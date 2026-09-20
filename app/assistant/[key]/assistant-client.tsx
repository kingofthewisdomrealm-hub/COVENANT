'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { Card, Proposal } from '@/lib/assistant/tools'
import type { Lead } from '@/lib/assistant/db'

import { LoopViz, type Viz } from './loop-viz'
import { assistantStyles } from './styles'

type Model = { group: string; kind: string; tag: string; name: string; what: string; ask?: string; link: string }
type Turn = { role: 'user' | 'assistant'; content: string }
type Entry =
	| { id: number; kind: 'user'; text: string }
	| { id: number; kind: 'bot'; text: string; thinking?: boolean }
	| { id: number; kind: 'act'; text: string; status: 'run' | 'ok' | 'err' }
	| { id: number; kind: 'card'; card: Card }
	| { id: number; kind: 'gate'; proposal: Proposal; decided?: 'yes' | 'no'; result?: string }
type Chip = { text: string; cls: string }
type NoId<T> = T extends unknown ? Omit<T, 'id'> : never

const HINTS = [
	['3 past-due leads', 'Find 3 buildings past their milestone deadline and propose them as CRM leads.'],
	['storm check', 'Run a storm check: ZIP 34982, 18-year-old shingle roof, dents in the gutters and granules in the downspouts, noticed after Hurricane Milton.'],
	['money map', 'A homeowner in Vero Beach (ZIP 32963) wants to storm-proof a single-family home. Which programs likely fit?'],
	['design a brief', "Design a project brief: condo building, 30-100 units, needs balcony restoration and waterproofing, board has the engineer's report in hand, timeline 3-6 months."],
	['the milestone law', 'What does the milestone law require, in plain words?'],
]

const COLS: Record<string, RegExp> = {
	name: /^(building|name|association|condo|property)/i, city: /^(city|town)/i, address: /^(address|street)/i, stories: /^(stories|storeys|floors|height)/i,
	year_built: /^(year|built|yr)/i, deadline: /^(deadline|due|milestone|inspection)/i, status: /^(status|state|priority)/i, contact: /^(contact|president|board|manager|mgmt|management)/i,
	phone: /^(phone|tel|cell|mobile)/i, called: /^(called|contacted|reached)/i, notes: /^(notes?|comments?|intel)/i,
}
function toDate(v: string) {
	v = v.trim()
	if (!v) return ''
	let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
	if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
	m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/)
	if (m) return `${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`
	m = v.match(/^(\d{4})$/)
	if (m) return `${m[1]}-12-31`
	const d = new Date(v)
	return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}
function statusFrom(deadline: string, raw: string) {
	const r = raw.toLowerCase().replace(/[\s-]+/g, '_')
	if (/past|overdue|late/.test(r)) return 'past_due'
	if (/this_year|due_this|due_now|^due/.test(r)) return 'due_this_year'
	if (/not_req|exempt|n\/a|none/.test(r)) return 'not_required'
	if (/upcoming|future|later/.test(r)) return 'upcoming'
	if (!deadline) return 'unknown'
	const t = new Date().toISOString().slice(0, 10)
	if (deadline < t) return 'past_due'
	if (deadline.slice(0, 4) === t.slice(0, 4)) return 'due_this_year'
	return 'upcoming'
}
function parsePaste(text: string) {
	const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim())
	if (lines.length < 2) return { rows: [], problems: ['Need a header row plus at least one building.'], map: {} as Record<string, number>, head: [] as string[] }
	const sep = lines[0].includes('\t') ? '\t' : ','
	const head = lines[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ''))
	const map: Record<string, number> = {}
	head.forEach((h, i) => Object.keys(COLS).forEach((k) => { if (map[k] === undefined && COLS[k].test(h)) map[k] = i }))
	const problems: string[] = []
	if (map.name === undefined) problems.push("No 'building' or 'name' column found in the header row.")
	const rows = lines.slice(1).map((l, j) => {
		const c = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, ''))
		const g = (k: string) => (map[k] === undefined ? '' : c[map[k]] ?? '')
		const name = g('name')
		if (!name) return null
		const deadline = toDate(g('deadline'))
		return {
			id: `r${String(j + 1).padStart(3, '0')}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`,
			name, city: g('city'), address: g('address'), stories: g('stories').replace(/\D/g, '') || null, year_built: g('year_built').replace(/\D/g, '') || null,
			deadline: deadline || null, status: statusFrom(deadline, g('status')), contact: g('contact'), phone: g('phone'), called: /^(y|yes|true|1|x|done)/i.test(g('called')), notes: g('notes'),
		}
	}).filter((r): r is NonNullable<typeof r> => r !== null)
	return { rows, problems, map, head }
}

function fmt(s: string) {
	const esc = s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)
	return esc.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
}

export function AssistantClient({ secret, configured, missing, models }: { secret: string; configured: boolean; missing: string[]; models: Model[] }) {
	const vizRef = useRef<Viz | null>(null)
	const [entries, setEntries] = useState<Entry[]>([])
	const [chips, setChips] = useState<Chip[]>([])
	const [goal, setGoal] = useState('no goal yet')
	const [status, setStatus] = useState(configured ? 'ready' : 'not configured')
	const [phase, setPhase] = useState('idle')
	const [lap, setLap] = useState(0)
	const [busy, setBusy] = useState(false)
	const [note, setNote] = useState('')
	const [input, setInput] = useState('')
	const [drawer, setDrawer] = useState<'none' | 'leads' | 'models' | 'load'>('none')
	const [leads, setLeads] = useState<Lead[]>([])
	const [counts, setCounts] = useState<{ buildings: number; programs: number; by_status: Record<string, number> } | null>(null)
	const [paste, setPaste] = useState('')
	const [replace, setReplace] = useState(true)
	const [loadMsg, setLoadMsg] = useState('')
	const turns = useRef<Turn[]>([])
	const proposed = useRef<string[]>([])
	const ctl = useRef<AbortController | null>(null)
	const nextId = useRef(1)
	const logRef = useRef<HTMLDivElement>(null)

	const add = useCallback((e: NoId<Entry>) => {
		const id = nextId.current++
		setEntries((list) => [...list, { ...e, id } as Entry])
		return id
	}, [])
	const patch = useCallback((id: number, fn: (e: Entry) => Entry) => setEntries((list) => list.map((e) => (e.id === id ? fn(e) : e))), [])
	const chip = useCallback((text: string, cls = 'tool') => setChips((c) => [...c, { text, cls }].slice(-8)), [])
	useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }) }, [entries])

	const refresh = useCallback(async (load?: { rows: unknown[]; replace: boolean }) => {
		const r = await fetch('/api/assistant/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: secret, load }) })
		const j = await r.json()
		if (!r.ok) throw new Error(j.error || 'state failed')
		setLeads(j.leads ?? [])
		setCounts({ buildings: j.buildings, programs: j.programs, by_status: j.by_status ?? {} })
		return j as { loaded: number | null; buildings: number; programs: number }
	}, [secret])

	useEffect(() => {
		if (!configured) {
			add({ kind: 'bot', text: `Not configured yet. Missing in Vercel: ${missing.join(', ')}. See docs/assistant.md.` })
			return
		}
		refresh()
			.then((j) => add({ kind: 'bot', text: j.buildings ? `Ready. I can see ${j.buildings} buildings, ${j.programs} homeowner programs, and the playbook. I can also run the storm check, the money map and the project designer right here (press models). Give me a job — I'll plan first, ask before anything touches the CRM, and report what changed.` : `Ready, but the buildings list is empty. Press load and paste your milestone list from Excel. I can still run the storm check, the money map and the project designer.` }))
			.catch((e) => { setStatus('error'); add({ kind: 'bot', text: `Can't reach the database: ${e.message}. Did you run supabase/assistant/001_assistant.sql and set the secret?` }) })
	}, [configured, missing, refresh, add])

	const send = useCallback(async (text?: string) => {
		const q = (text ?? input).trim()
		if (!q || busy || !configured) return
		setInput('')
		setNote('')
		add({ kind: 'user', text: q })
		turns.current.push({ role: 'user', content: q })
		setGoal(`goal: ${q.slice(0, 60)}${q.length > 60 ? '…' : ''}`)
		setLap((n) => n + 1)
		vizRef.current?.phase('think')
		vizRef.current?.light(q)
		vizRef.current?.moon(null)
		const bubble = add({ kind: 'bot', text: 'Thinking…', thinking: true })
		setBusy(true)
		setStatus('working')
		ctl.current = new AbortController()
		const acts = new Map<string, number>()
		let finalText = ''
		try {
			const r = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: secret, messages: turns.current.slice(-16), proposed: proposed.current }), signal: ctl.current.signal })
			if (!r.ok || !r.body) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`)
			const reader = r.body.getReader()
			const dec = new TextDecoder()
			let buf = ''
			for (;;) {
				const { value, done } = await reader.read()
				if (done) break
				buf += dec.decode(value, { stream: true })
				let nl: number
				while ((nl = buf.indexOf('\n')) >= 0) {
					const line = buf.slice(0, nl).trim()
					buf = buf.slice(nl + 1)
					if (!line) continue
					const ev = JSON.parse(line)
					if (ev.type === 'phase') vizRef.current?.phase(ev.phase)
					else if (ev.type === 'text') { finalText = ev.text; patch(bubble, (e) => ({ ...(e as Extract<Entry, { kind: 'bot' }>), text: ev.text, thinking: false })) }
					else if (ev.type === 'tool') {
						if (ev.status === 'start') { acts.set(ev.id, add({ kind: 'act', text: ev.label, status: 'run' })); if (ev.moon) vizRef.current?.moon(ev.moon) }
						else {
							const id = acts.get(ev.id)
							if (id) patch(id, (e) => ({ ...(e as Extract<Entry, { kind: 'act' }>), text: ev.label, status: ev.status === 'ok' ? 'ok' : 'err' }))
							if (ev.moon) vizRef.current?.moon(ev.moon)
							if (ev.status === 'ok') { chip(ev.label, ev.card ? 'done' : 'tool'); vizRef.current?.light(ev.label) }
							if (ev.card) {
								if (ev.card.kind === 'gate') { proposed.current.push(ev.card.proposal.building_id); add({ kind: 'gate', proposal: ev.card.proposal }) }
								else add({ kind: 'card', card: ev.card })
							}
							// the "Thinking…" bubble must stay last: move it after the tool output
							setEntries((list) => { const b = list.find((e) => e.id === bubble); return b ? [...list.filter((e) => e.id !== bubble), b] : list })
						}
					} else if (ev.type === 'done') { finalText = ev.text || finalText; proposed.current = ev.proposed ?? proposed.current }
					else if (ev.type === 'error') throw new Error(ev.message)
				}
			}
			patch(bubble, (e) => ({ ...(e as Extract<Entry, { kind: 'bot' }>), text: finalText || '(no answer)', thinking: false }))
			turns.current.push({ role: 'assistant', content: finalText })
			vizRef.current?.phase('done')
			vizRef.current?.light(finalText)
			setTimeout(() => { vizRef.current?.phase('idle'); vizRef.current?.moon(null) }, 2500)
			setStatus('ready')
			refresh().catch(() => {})
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e)
			if (finalText) patch(bubble, (x) => ({ ...(x as Extract<Entry, { kind: 'bot' }>), text: finalText, thinking: false }))
			else setEntries((list) => list.filter((x) => x.id !== bubble))
			setNote(msg === 'The user aborted a request.' || /abort/i.test(msg) ? '' : msg)
			vizRef.current?.phase('idle'); vizRef.current?.moon(null)
			setStatus(/abort/i.test(msg) ? 'stopped' : 'error')
		} finally { setBusy(false); ctl.current = null }
	}, [input, busy, configured, secret, add, patch, chip, refresh])

	const decide = useCallback(async (id: number, p: Proposal, yes: boolean) => {
		patch(id, (e) => ({ ...(e as Extract<Entry, { kind: 'gate' }>), decided: yes ? 'yes' : 'no' }))
		if (!yes) { chip(`skipped: ${p.name}`); turns.current.push({ role: 'user', content: `Skipped: ${p.name}. Do not propose it again.` }); return }
		vizRef.current?.moon('crm'); vizRef.current?.phase('act')
		const a = add({ kind: 'act', text: 'writing to CRM…', status: 'run' })
		try {
			const r = await fetch('/api/assistant/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: secret, proposal: p }) })
			const j = await r.json()
			if (!r.ok) throw new Error(j.error || 'approve failed')
			const ok = Boolean(j.project_id)
			patch(a, (e) => ({ ...(e as Extract<Entry, { kind: 'act' }>), text: ok ? `CRM: added ${p.name}` : `saved here, CRM said: ${j.crm_error}`, status: ok ? 'ok' : 'err' }))
			patch(id, (e) => ({ ...(e as Extract<Entry, { kind: 'gate' }>), result: ok ? `CRM job ${String(j.project_id).slice(0, 8)}…` : `kept in assistant leads (CRM: ${j.crm_error})` }))
			chip(`CRM + ${p.name}`, 'done')
			turns.current.push({ role: 'user', content: `Approved: ${p.name} was added${ok ? ` as CRM job ${j.project_id}` : ` to the assistant leads (CRM write failed: ${j.crm_error})`}.` })
			refresh().catch(() => {})
		} catch (e) {
			patch(a, (x) => ({ ...(x as Extract<Entry, { kind: 'act' }>), text: e instanceof Error ? e.message : String(e), status: 'err' }))
		} finally { vizRef.current?.phase('look'); setTimeout(() => { vizRef.current?.phase('idle'); vizRef.current?.moon(null) }, 2000) }
	}, [secret, add, patch, chip, refresh])

	const parsed = paste.trim() ? parsePaste(paste) : null
	const doLoad = async () => {
		if (!parsed || !parsed.rows.length) return
		setLoadMsg('loading…')
		try {
			const j = await refresh({ rows: parsed.rows, replace })
			setLoadMsg(`Loaded ${j.loaded}. The assistant now sees ${j.buildings} buildings.`)
			add({ kind: 'bot', text: `Buildings list updated: ${j.buildings} buildings. Ask me for the past-due ones.` })
			chip(`buildings loaded: ${j.loaded}`, 'done')
			setPaste('')
		} catch (e) { setLoadMsg(`Could not write: ${e instanceof Error ? e.message : String(e)}`) }
	}
	const toggle = (d: typeof drawer) => setDrawer((cur) => (cur === d ? 'none' : d))

	return (
		<div className="cva">
			<style dangerouslySetInnerHTML={{ __html: assistantStyles }} />
			<LoopViz vizRef={vizRef} onPhase={setPhase} />

			<div className="cva-panel">
				<div className="cva-head">
					<div>
						<h1>Covenant Assistant</h1>
						<div className="sub">claude &middot; your rules &middot; your crm &middot; <b>{status}</b></div>
					</div>
					<div className="btns">
						<button type="button" className={`b-load${drawer === 'load' ? ' on' : ''}`} onClick={() => toggle('load')} title="load the real buildings list">load</button>
						<button type="button" className={`b-models${drawer === 'models' ? ' on' : ''}`} onClick={() => toggle('models')}>models</button>
						<button type="button" className={`b-leads${drawer === 'leads' ? ' on' : ''}`} onClick={() => toggle('leads')}>leads {leads.length}</button>
					</div>
				</div>
				<div className="cva-ctx"><span className="k">context</span><span className="cchip goal">{goal}</span>{chips.map((c, i) => <span key={i} className={`cchip ${c.cls}`} title={c.text}>{c.text}</span>)}</div>
				<div className="cva-log" ref={logRef}>
					{entries.map((e) => {
						if (e.kind === 'user') return <div key={e.id} className="msg user">{e.text}</div>
						if (e.kind === 'bot') return <div key={e.id} className={`msg bot${e.thinking ? ' thinking' : ''}`} dangerouslySetInnerHTML={{ __html: fmt(e.text) }} />
						if (e.kind === 'act') return <div key={e.id} className={`act ${e.status}`}><i /><span>{e.text}</span></div>
						if (e.kind === 'gate') return <GateCard key={e.id} e={e} onDecide={(yes) => decide(e.id, e.proposal, yes)} />
						return <ResultCard key={e.id} card={e.card} />
					})}
				</div>
				{note && <div className="cva-note">{note}</div>}
				<div className="cva-hint">try: {HINTS.map(([label, q], i) => <span key={label}>{i > 0 && ' · '}<button type="button" onClick={() => { setInput(q) }}>{label}</button></span>)}</div>
				<div className="cva-compose">
					<textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} placeholder="Give it a job…" disabled={!configured} />
					{busy ? <button type="button" className="stop" onClick={() => ctl.current?.abort()}>stop</button> : <button type="button" className="send" onClick={() => send()} disabled={!configured || !input.trim()}>send</button>}
				</div>
			</div>

			{drawer === 'leads' && (
				<div className="cva-drawer">
					<h2>CRM &middot; leads</h2><div className="sub">written only after your nod</div>
					{!leads.length && <div className="empty">No leads yet.</div>}
					{leads.map((l) => (
						<div key={l.id} className="lead"><b>{l.building}</b>{l.crm_error && <span className="badge">crm failed</span>}
							<div className="m">{l.city ?? ''} · deadline {l.deadline ?? '?'} · {l.contact || 'no contact'}</div>
							<div className="why">{l.reason}{l.next_step ? ` — next: ${l.next_step}` : ''}</div>
							<div className="m">{l.project_id ? `CRM job ${l.project_id.slice(0, 8)}…` : l.crm_error || ''} · {l.created_at.slice(0, 10)}</div>
						</div>
					))}
				</div>
			)}
			{drawer === 'models' && (
				<div className="cva-drawer wide">
					<h2>The models</h2><div className="sub">covenant tools the assistant can run &middot; visual models you can open</div>
					{models.map((m, i) => (
						<div key={m.name}>
							{(i === 0 || models[i - 1].group !== m.group) && <div className="grp">{m.group}</div>}
							<div className={`mcard ${m.kind}`}><div className="ic">{m.tag}</div><div><b>{m.name}</b><div className="what">{m.what}</div>
								<div className="act2">{m.ask && <button type="button" onClick={() => { setInput(m.ask!); setDrawer('none') }}>run it here</button>}<a href={m.link} target="_blank" rel="noopener noreferrer">open {m.kind === 'tool' ? 'the page' : 'the model'} &rarr;</a></div></div></div>
						</div>
					))}
				</div>
			)}
			{drawer === 'load' && (
				<div className="cva-drawer wide">
					<h2>Load the real buildings</h2><div className="sub">{counts ? `${counts.buildings} in the list now` : ''} &middot; paste from Excel</div>
					<p>Open your milestone list in Excel, select the rows <b>with the header row</b>, copy, and paste below. I match columns by their names: <b>building / name, city, stories, year built, deadline, status, contact, phone, called, notes</b>. Missing status? I work it out from the deadline.</p>
					<textarea className="paste" value={paste} onChange={(e) => { setPaste(e.target.value); setLoadMsg('') }} placeholder={'Building\tCity\tStories\tYear built\tDeadline\tContact\tPhone'} />
					<div className="preview">
						{loadMsg ? loadMsg : !parsed ? 'Paste to see a preview.' : parsed.problems.length ? <span className="bad">{parsed.problems.join(' ')}</span> : (
							<>
								<b>{parsed.rows.length} buildings</b> · {Object.entries(parsed.rows.reduce<Record<string, number>>((m, r) => ((m[r.status] = (m[r.status] ?? 0) + 1), m), {})).map(([k, v]) => `${k}: ${v}`).join(', ')}
								<br />columns: {Object.keys(parsed.map).map((k) => `${k} ← ${parsed.head[parsed.map[k]]}`).join(' · ')}
								{parsed.map.deadline === undefined && <><br /><span className="bad">no deadline column - every status will be &quot;unknown&quot;</span></>}
							</>
						)}
					</div>
					<div className="row"><label><input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} /> replace the current list (keeps buildings that are already CRM jobs)</label>
						<button type="button" className="go" disabled={!parsed || !parsed.rows.length || !!parsed.problems.length} onClick={doLoad}>load {parsed?.rows.length ?? 0} buildings</button></div>
				</div>
			)}

			<div className="cva-lap"><span>{phase}</span>lap <b>{lap}</b></div>
		</div>
	)
}

function GateCard({ e, onDecide }: { e: Extract<Entry, { kind: 'gate' }>; onDecide: (yes: boolean) => void }) {
	const p = e.proposal
	return (
		<div className={`gate${e.decided ? ' decided' : ''}`}>
			<div className="t">{e.decided === 'yes' ? 'checkpoint · approved' : e.decided === 'no' ? 'checkpoint · skipped' : 'checkpoint · add to CRM?'}</div>
			<div className="body"><b>{p.name}</b> — {p.city ?? ''} · {p.stories ?? '?'} stories · deadline <b>{p.deadline ?? 'needs manual lookup'}</b><br />{p.reason}{p.next_step && <><br /><span className="k">next: {p.next_step}</span></>}{e.result && <><br /><span className="k">{e.result}</span></>}</div>
			{!e.decided && <div className="row"><button type="button" className="yes" onClick={() => onDecide(true)}>add it</button><button type="button" className="no" onClick={() => onDecide(false)}>skip</button></div>}
		</div>
	)
}

function ResultCard({ card }: { card: Card }) {
	if (card.kind === 'storm') return (
		<div className="card">
			<div className="t"><span>storm check · {card.zip}{card.county ? ` · ${card.county}` : ''}</span><span className={`band ${card.band}`}>{card.band} · {card.score}/100</span></div>
			<h3>{card.title}</h3>
			<div className="meter"><i style={{ width: `${card.score}%` }} /></div>
			{card.signs.length ? <div className="row">{card.signs.map((s) => <span key={s} className="pill">{s}</span>)}</div> : <div className="k">no ground-level signs checked</div>}
			{card.events.length ? <ul>{card.events.map((ev) => <li key={ev.label}><b>{ev.label}</b> <span className="k">{ev.detail}</span></li>)}</ul> : <div className="k">no recorded storm event on file for this ZIP</div>}
			<div className="fine">{card.disclaimer} {card.notice}</div>
		</div>
	)
	if (card.kind === 'programs') return (
		<div className="card">
			<div className="t"><span>programs · {card.title}{card.county ? ` · ${card.county}` : ''}</span><span className="band">{card.items.length} likely fit</span></div>
			{card.items.map((p) => (
				<div key={p.name} className="prog"><b>{p.name}</b>{p.status && <span className={`m st${/closed|paused|waitlist/i.test(p.status) ? ' off' : ''}`}> {p.status}</span>}<div>{p.pays}</div>{p.note && <div className="k">{p.note}</div>}
					{p.contact?.length ? <div className="m">{p.contact.map((c, i) => <span key={i}>{i > 0 && ' · '}{c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a> : c.label}</span>)}</div> : null}</div>
			))}
			<div className="fine">Which programs likely fit, never a promise: final eligibility always belongs to the program.</div>
		</div>
	)
	if (card.kind !== 'brief') return null
	return (
		<div className="card">
			<div className="t"><span>project brief · {card.branch}</span><span className="band">design your project</span></div>
			<div className="row">{card.scope.map((s) => <span key={s} className="pill">{s}</span>)}</div>
			{card.rows.map(([k, v]) => <div key={k}><span className="k">{k}:</span> {v}</div>)}
			<div style={{ marginTop: '.4rem' }}><span className="k">next:</span> {card.next}</div>
			<div className="fine">{card.license}. {card.disclaimer}{card.notice ? ` ${card.notice}` : ''}</div>
		</div>
	)
}
