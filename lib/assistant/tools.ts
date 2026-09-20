import {
	BRIEF_DISCLAIMER,
	STORM_INSURANCE_NOTICE,
	boardStages,
	finishLevels,
	projectBranches,
	timelineOptions,
	type BranchKey,
} from '@/content/design-your-project'
import { siteConfig } from '@/content/site'
import {
	COUNTY_NAMES,
	STORM_CHECK_DISCLAIMER,
	bandCopy,
	countyForZip,
	damageSigns,
	scoreStormCheck,
} from '@/content/storm-check'
import { matchPrograms, needFromWords, propertyFromWords } from '@/lib/programs-match'

import { db, type Building, type Program } from './db'

/**
 * The eight tools the assistant can call. Each returns `result` (what Claude
 * reads) and, optionally, a `card` (what the person sees in the chat).
 * Nothing here writes to the CRM: propose_lead only returns a proposal, and
 * the approve route (app/api/assistant/approve) does the writing after a
 * human clicks "add it".
 */

export type Card =
	| { kind: 'storm'; zip: string; county: string | null; score: number; band: 'likely' | 'possible' | 'low'; title: string; signs: string[]; events: { label: string; detail: string }[]; disclaimer: string; notice: string }
	| { kind: 'programs'; title: string; county: string | null; items: { name: string; pays: string; note?: string; status?: string | null; contact?: { label: string; href?: string }[] }[] }
	| { kind: 'brief'; branch: string; scope: string[]; rows: [string, string][]; next: string; license: string; disclaimer: string; notice?: string }
	| { kind: 'gate'; proposal: Proposal }

export type Proposal = {
	building_id: string
	name: string
	city: string | null
	stories: number | null
	deadline: string | null
	contact: string | null
	phone: string | null
	reason: string
	next_step: string
}

export type ToolContext = { key: string; proposed: Set<string> }
export type ToolOutcome = { result: unknown; card?: Card; label: string; moon: string }

export type Tool = {
	name: string
	description: string
	input_schema: { type: 'object'; properties: Record<string, unknown>; required?: string[] }
	execute: (input: Record<string, unknown>, ctx: ToolContext) => Promise<ToolOutcome>
}

const LICENSE = `Florida ${siteConfig.license.classification} ${siteConfig.license.number}`
const NEXT_STEP = `A free walkthrough. Call ${siteConfig.phones.sr.display} or book the calendar. ${siteConfig.responseExpectation}`

function s(v: unknown) {
	return v === undefined || v === null ? '' : String(v)
}
function list(v: unknown): string[] {
	return Array.isArray(v) ? v.map(s).filter(Boolean) : s(v) ? [s(v)] : []
}
function pick(options: readonly string[], value: unknown): string | null {
	const v = s(value).trim().toLowerCase()
	if (!v) return null
	return (
		options.find((o) => o.toLowerCase() === v) ??
		options.find((o) => o.toLowerCase().includes(v) || v.includes(o.toLowerCase().split(' ')[0])) ??
		s(value)
	)
}

/* ---- storm check: the site's own scoring, sign keys → sign labels ---- */
const SIGN_KEYS: Record<string, string> = {
	gutters: damageSigns[0].label,
	ac: damageSigns[1].label,
	screens: damageSigns[2].label,
	granules: damageSigns[3].label,
	shingles: damageSigns[4].label,
	tiles: damageSigns[5].label,
	leak: damageSigns[6].label,
	fence: damageSigns[7].label,
	none: damageSigns[8].label,
}
function signLabels(input: unknown): string[] {
	return list(input)
		.map((raw) => {
			const v = raw.toLowerCase()
			if (SIGN_KEYS[v]) return SIGN_KEYS[v]
			const byKey = Object.keys(SIGN_KEYS).find((k) => v.includes(k))
			if (byKey) return SIGN_KEYS[byKey]
			return damageSigns.find((d) => d.label.toLowerCase().includes(v))?.label ?? ''
		})
		.filter(Boolean)
}
function roofAgeOption(v: unknown): string {
	const t = s(v).toLowerCase()
	if (/over|20\+|>\s*20|older/.test(t)) return 'Over 20 years'
	if (/15/.test(t)) return '15–20 years'
	if (/10/.test(t)) return '10–15 years'
	if (/5/.test(t)) return '5–10 years'
	if (/under|new|<\s*5/.test(t)) return 'Under 5 years'
	return 'I’m not sure'
}
function noticedOption(v: unknown): string {
	const t = s(v).toLowerCase()
	if (!t || /not sure|unsure|don.t know/.test(t)) return 'Not sure — I just want it checked'
	return t
}

export const tools: Tool[] = [
	{
		name: 'search_buildings',
		description:
			'Search the buildings list (condo/co-op buildings with milestone-inspection deadlines). Returns up to `max` rows with id, name, city, stories, year_built, deadline (YYYY-MM-DD), status (past_due, due_this_year, upcoming, not_required, unknown), board contact, phone, whether it was already called, and whether it is already a CRM lead. Use before naming any building.',
		input_schema: {
			type: 'object',
			properties: {
				status: { type: 'string', description: 'past_due | due_this_year | upcoming | any' },
				city: { type: 'string' },
				max: { type: 'number' },
				include_called: { type: 'boolean' },
			},
		},
		async execute(input, ctx) {
			const rows = await db.buildings(ctx.key)
			const st = s(input.status) || 'any'
			const city = s(input.city).toLowerCase()
			const max = Math.min(25, Number(input.max) || 10)
			const inc = Boolean(input.include_called)
			const out = rows
				.filter((r) => (st === 'any' || r.status === st) && (!city || (r.city ?? '').toLowerCase().includes(city)) && (inc || !r.called))
				.slice(0, max)
				.map((r) => ({
					id: r.id, name: r.name, city: r.city, stories: r.stories, year_built: r.year_built, deadline: r.deadline, status: r.status,
					contact: r.contact, phone: r.phone, called: r.called, already_lead: Boolean(r.lead_project_id), notes: r.notes,
				}))
			return { result: { rows: out, total_in_list: rows.length }, label: `buildings: ${out.length} found`, moon: 'buildings' }
		},
	},
	{
		name: 'get_knowledge',
		description:
			"Read the Covenant playbook. Topics: 'milestone-law' (Florida milestone inspection / SIRS rules, plain words), 'services', 'outreach' (how we talk to boards), 'storm-check' (how the storm quiz scores, recorded storms, compliance rules), 'design' (every branch and option of the project designer), 'build-order' (the right order of steps for a roof and a house), 'faqs', 'site' (licence, address, phone, hours, service area). Use before explaining any of these.",
		input_schema: { type: 'object', properties: { topic: { type: 'string', description: 'milestone-law | services | outreach | storm-check | design | build-order | faqs | site | all' } } },
		async execute(input, ctx) {
			const docs = await db.knowledge(ctx.key, s(input.topic) || 'all')
			return { result: docs.map((d) => ({ topic: d.topic, text: d.body })), label: `playbook: ${docs.map((d) => d.topic).join(', ')}`, moon: 'knowledge' }
		},
	},
	{
		name: 'propose_lead',
		description:
			'Propose adding one building to the CRM as a lead (a contact + a job at the Lead milestone). This does NOT write anything: it shows the user an approve/skip card and returns {pending:true}. Give a one-sentence reason and a concrete next step. Never call it for a building that is already a lead, already called, or already proposed in this conversation.',
		input_schema: {
			type: 'object',
			properties: { building_id: { type: 'string' }, reason: { type: 'string' }, next_step: { type: 'string' } },
			required: ['building_id', 'reason'],
		},
		async execute(input, ctx) {
			const id = s(input.building_id)
			const rows = await db.buildings(ctx.key)
			const b = rows.find((r) => r.id === id)
			if (!b) throw new Error(`No building with id ${id}. Search first.`)
			if (b.lead_project_id) throw new Error(`${b.name} is already a CRM lead.`)
			if (ctx.proposed.has(id)) throw new Error(`${b.name} was already proposed in this conversation.`)
			ctx.proposed.add(id)
			const proposal: Proposal = {
				building_id: b.id, name: b.name, city: b.city, stories: b.stories, deadline: b.deadline, contact: b.contact, phone: b.phone,
				reason: s(input.reason), next_step: s(input.next_step),
			}
			return { result: { pending: true, building: b.name, note: 'Waiting for the human to approve or skip. End your turn.' }, card: { kind: 'gate', proposal }, label: `proposed: ${b.name}`, moon: 'human' }
		},
	},
	{
		name: 'list_leads',
		description: 'List the leads the assistant has added (building, deadline, contact, reason, next step, CRM job id or the CRM error). Use to avoid duplicates or to report.',
		input_schema: { type: 'object', properties: {} },
		async execute(_input, ctx) {
			const leads = await db.leads(ctx.key)
			return {
				result: leads.map((l) => ({ building: l.building, city: l.city, deadline: l.deadline, contact: l.contact, reason: l.reason, next_step: l.next_step, crm_job: l.project_id, crm_error: l.crm_error, added_at: l.created_at })),
				label: `CRM: ${leads.length} leads`, moon: 'crm',
			}
		},
	},
	{
		name: 'storm_check',
		description:
			"Run the Covenant storm check (covenantbuilders.org/storm-check). Give the 5-digit ZIP, the ground-level signs the owner can see (any of: gutters, ac, screens, granules, shingles, tiles, leak, fence, none), the roof age ('under 5', '5-10', '10-15', '15-20', 'over 20', 'not sure'), and when it was noticed ('after Hurricane Milton', 'after the May 2025 hailstorm', 'after a storm this summer', 'not sure'). Returns the score 0-100, the band (likely / possible / low), the county, any recorded official storm event for that ZIP, the plain-words verdict, and the disclaimer you must repeat. Ask for missing answers before calling; do not guess signs.",
		input_schema: {
			type: 'object',
			properties: { zip: { type: 'string' }, signs: { type: 'array', items: { type: 'string' } }, roof_age: { type: 'string' }, noticed: { type: 'string' } },
			required: ['zip', 'signs'],
		},
		async execute(input) {
			const zip = s(input.zip).trim()
			const signs = signLabels(input.signs)
			const r = scoreStormCheck({ zip, signs, roofAge: roofAgeOption(input.roof_age), noticed: noticedOption(input.noticed) })
			const county = countyForZip(zip)
			const countyName = county ? COUNTY_NAMES[county] : null
			const copy = bandCopy[r.band]
			const card: Card = { kind: 'storm', zip, county: countyName, score: r.score, band: r.band, title: copy.title, signs, events: r.events.map((e) => ({ label: e.label, detail: e.detail })), disclaimer: STORM_CHECK_DISCLAIMER, notice: STORM_INSURANCE_NOTICE }
			return {
				result: {
					score: r.score, band: r.band, county: countyName, signs_counted: signs,
					events: r.events.map((e) => ({ label: e.label, date: e.date, detail: e.detail, source: e.source })),
					verdict_title: copy.title, verdict_body: copy.body,
					next_step: r.band === 'low' ? 'Walk the property after the next storm and check again.' : `A licensed contractor on the roof: a free visit, a written answer either way. Call ${siteConfig.phones.sr.display}.`,
					disclaimer: STORM_CHECK_DISCLAIMER, insurance_notice: STORM_INSURANCE_NOTICE,
					rules: 'Repeat the disclaimer word for word. Never mention claims, deductibles or costs.',
				},
				card, label: `storm check: ${r.band} (${r.score}/100)`, moon: 'storm',
			}
		},
	},
	{
		name: 'find_programs',
		description:
			"The money map (covenantbuilders.org/homeowner-programs). Two ways. (1) MATCH: give `need` (storm-proof | claim | repair-money | taxes, or plain words), `property` (single-family | condo-unit | condo-association | rental-commercial) and `zip`; returns the programs that likely fit, the same way the site does. (2) SEARCH: give `keyword` and/or `scope` (statewide, Indian River County, St. Lucie County, Martin County, Brevard County, Orange County, Osceola County, Seminole County, Lake County) to list matching programs with status and contact. Never say 'you qualify'; say 'likely fits'.",
		input_schema: {
			type: 'object',
			properties: { need: { type: 'string' }, property: { type: 'string' }, zip: { type: 'string' }, keyword: { type: 'string' }, scope: { type: 'string' }, max: { type: 'number' } },
		},
		async execute(input, ctx) {
			const all = await db.programs(ctx.key)
			const county = countyForZip(s(input.zip).trim())
			const countyName = county ? COUNTY_NAMES[county] : null
			type Item = { name: string; pays: string; note?: string; status?: string | null; contact?: Program['contact']; access?: string[]; scope?: string | null }
			let items: Item[] = []
			let title = ''
			if (s(input.need)) {
				const need = needFromWords(s(input.need))
				const property = propertyFromWords(s(input.property))
				const byName = (n: string) => all.find((p) => p.name.toLowerCase().startsWith(n.toLowerCase().split(' (')[0].slice(0, 18)))
				items = matchPrograms(need, property, countyName).map((m) => {
					const full = byName(m.name)
					return { name: m.name, pays: m.pays, note: m.note, status: full?.status ?? null, contact: full?.contact ?? [], access: full?.access ?? [], scope: full?.scope ?? null }
				})
				title = `match: ${need} / ${property}`
			} else {
				const kw = s(input.keyword).toLowerCase()
				const sc = s(input.scope).toLowerCase()
				const max = Math.min(20, Number(input.max) || 12)
				items = all
					.filter((p) => {
						const hay = `${p.name} ${p.bucket} ${p.summary} ${p.scope}`.toLowerCase()
						const scopeOk = !sc || (p.scope ?? '').toLowerCase().includes(sc) || (countyName ? (p.scope ?? '').toLowerCase().includes(countyName.toLowerCase().split(' ')[0]) && sc.includes(countyName.toLowerCase().split(' ')[0]) : false)
						return (!kw || hay.includes(kw)) && scopeOk
					})
					.slice(0, max)
					.map((p) => ({ name: p.name, pays: p.summary ?? '', status: p.status, contact: p.contact, access: p.access, scope: p.scope }))
				title = `search: ${kw || 'all'}${sc ? ' / ' + sc : ''}`
			}
			const card: Card = { kind: 'programs', title, county: countyName, items: items.map((i) => ({ name: i.name, pays: i.pays, note: i.note, status: i.status, contact: i.contact })) }
			return { result: { county: countyName, programs: items, total_in_database: all.length, rules: "Say 'likely fits', never 'you qualify'. Repeat contact details exactly as given." }, card, label: `programs: ${items.length} found`, moon: 'programs' }
		},
	},
	{
		name: 'design_brief',
		description:
			"Design Your Project (covenantbuilders.org/design-your-project). Turns answers into a written project brief. `branch`: new-home | remodel | kitchen | commercial | condo | storm | unsure. `property`: one of that branch's property options. `scope`: list of what's included. `size` (not for condo), `finish` (practical | refined | custom; not for condo or storm), `board_stage` (condo only), `timeline`, `notes`. Read get_knowledge 'design' first if you need the exact option lists. Returns the brief, the licence line and the disclaimer you must repeat. Never add prices.",
		input_schema: {
			type: 'object',
			properties: { branch: { type: 'string' }, property: { type: 'string' }, scope: { type: 'array', items: { type: 'string' } }, size: { type: 'string' }, finish: { type: 'string' }, board_stage: { type: 'string' }, timeline: { type: 'string' }, notes: { type: 'string' } },
			required: ['branch', 'scope'],
		},
		async execute(input) {
			const raw = s(input.branch).toLowerCase().replace(/[^a-z-]/g, '')
			const branch = projectBranches.find((b) => b.key === raw) ?? projectBranches.find((b) => raw.includes(b.key) || b.key.includes(raw)) ?? projectBranches.find((b) => b.key === 'unsure')!
			const scope = list(input.scope).map((x) => pick(branch.scopeOptions, x) ?? x)
			const finishKey = branch.usesFinishLevel ? s(input.finish).toLowerCase() : ''
			const finish = finishLevels.find((f) => f.value.toLowerCase() === finishKey)
			const brief = {
				branch: branch.key as BranchKey, branch_label: branch.label,
				property: pick(branch.propertyOptions, input.property), scope,
				size: branch.sizeOptions.length ? pick(branch.sizeOptions, input.size) : null,
				finish: finish ? `${finish.value} — ${finish.description}` : null,
				board_stage: branch.key === 'condo' ? pick(boardStages, input.board_stage) : null,
				timeline: pick(timelineOptions, input.timeline), notes: s(input.notes) || null,
				pricing: 'No prices. Pricing needs a site visit and a written scope.',
				next_step: NEXT_STEP, license: LICENSE, disclaimer: BRIEF_DISCLAIMER,
				insurance_notice: branch.key === 'storm' ? STORM_INSURANCE_NOTICE : undefined,
			}
			const rows: [string, string][] = (
				[['property', brief.property], ['size', brief.size], ['finish', brief.finish], ['board', brief.board_stage], ['timeline', brief.timeline], ['notes', brief.notes]] as [string, string | null][]
			).filter((r): r is [string, string] => Boolean(r[1]))
			const card: Card = { kind: 'brief', branch: branch.label, scope, rows, next: NEXT_STEP, license: LICENSE, disclaimer: BRIEF_DISCLAIMER, notice: brief.insurance_notice }
			return { result: brief, card, label: `brief: ${branch.label}`, moon: 'design' }
		},
	},
	{
		name: 'list_models',
		description: 'List every model the assistant knows: the Covenant tools it can run (storm check, money map, design brief, build order) and the visual models of how an LLM works, each with a link. Use when the user asks what you can do.',
		input_schema: { type: 'object', properties: {} },
		async execute() {
			return { result: MODELS, label: `models: ${MODELS.length}`, moon: 'knowledge' }
		},
	},
]

export const MODELS = [
	{ group: 'covenant tools (run them here)', kind: 'tool', tag: 'STRM', name: 'Storm Check', what: 'Does a storm look like it touched this roof? ZIP + what you can see from the ground, scored the way an inspector looks.', ask: 'Run a storm check for me. Ask me the questions one at a time.', link: `${siteConfig.url}/storm-check` },
	{ group: 'covenant tools (run them here)', kind: 'tool', tag: '$MAP', name: 'Money Map / Homeowner Programs', what: 'Real assistance programs: grants to storm-proof, repair money, free help with insurance disputes, property-tax relief. Matched to what the owner needs.', ask: 'Which programs likely fit me? Ask what I need, my property type and ZIP.', link: `${siteConfig.url}/homeowner-programs` },
	{ group: 'covenant tools (run them here)', kind: 'tool', tag: 'BRF', name: 'Design Your Project', what: 'Turns an idea into a project brief: branch, property, scope, size, finish, timeline. Ends with the licence and disclaimer.', ask: 'Help me design a project brief. Ask me the questions one at a time.', link: `${siteConfig.url}/design-your-project` },
	{ group: 'covenant tools (run them here)', kind: 'tool', tag: 'ORD', name: 'Build Order', what: 'The right order of steps for a roof and a house, from the build-order game. Skip a step and it leaks.', ask: 'Walk me through the build order for a roof, step by step, and what goes wrong if a step is skipped.', link: `${siteConfig.url}/play` },
	{ group: 'visual models (open them)', kind: 'visual', tag: '01', name: 'The Living Language Universe', what: 'Nine stages of what happens inside an LLM, as a 3D space you fly through.', link: 'https://claude.ai/artifact/GDUgoDLavRFnXQx2sXqv4v' },
	{ group: 'visual models (open them)', kind: 'visual', tag: '02', name: 'The Agent Loop', what: 'The same universe given hands: think, pick, act, look, with a human gate. This assistant runs that loop live.', link: 'https://claude.ai/artifact/RUAGyyCZ8JxYtimL8Z9eTp' },
	{ group: 'visual models (open them)', kind: 'visual', tag: '03', name: 'Lighting Design', what: 'The five prompt moves (why, what, with, how, prove) and what each one lights up.', link: 'https://claude.ai/artifact/ACd6Lrup5TRST9ynho3SAX' },
	{ group: 'visual models (open them)', kind: 'visual', tag: '04', name: 'The Prompt Behind This', what: 'The five questions again, with the prompt that built these pages as the example.', link: 'https://claude.ai/artifact/FXoX5LvcyTCXdazdu3qzPV' },
	{ group: 'visual models (open them)', kind: 'visual', tag: '05', name: 'Words Into Tokens', what: 'Zoomed in: a sentence becomes pieces, pieces become points in meaning-space.', link: 'https://claude.ai/artifact/1YMbB8mpt7vHKgvATyuCrT' },
	{ group: 'visual models (open them)', kind: 'visual', tag: '06', name: 'Inside the Layers', what: 'Zoomed in: tokens rising through six layers and sharpening into an output.', link: 'https://claude.ai/artifact/U7xc3nJQDz6UL9WvQphb44' },
] as const

export type BuildingRow = Building
