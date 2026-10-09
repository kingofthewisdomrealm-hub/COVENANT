/**
 * PHOTO ESTIMATOR — THE MATH.
 *
 * Deterministic: same answers in → same dollars out, every time. The AI never
 * touches this file. It reads the photos and suggests a category and scope;
 * the customer answers the questions; this file does arithmetic on the
 * pricebook. If anything needed is missing, the answer is "inspection", never
 * a guess.
 *
 * Imports are relative (not '@/') so the test script can run this file with
 * plain `npx tsx`.
 */

import { findScope } from '../../content/estimator/catalog'
import { isPricedScope, pricebook, type Range, type Tiered } from '../../content/estimator/pricebook'

export type Tier = 'budget' | 'standard' | 'premium'
export const TIERS: Tier[] = ['budget', 'standard', 'premium']
export type Answers = Record<string, string | number | undefined | null>
export type Money = { low: number; high: number }
export type AiConfidence = 'high' | 'medium' | 'low' | 'none'

export type TierResult = {
	tier: Tier
	materialNote?: string
	materials: Money
	labor: Money
	other: Money
	overheadProfit: Money
	total: Money
	minimumApplied: boolean
}

export type Quantity = { label: string; value: number; unit: string }

export type EstimateResult =
	| {
			kind: 'priced'
			categoryId: string
			scopeId: string
			tiers: TierResult[]
			quantities: Quantity[]
			assumptions: string[]
			confidence: 'high' | 'medium' | 'low'
			budgetIndication: boolean
			draftPrices: boolean
			asOf: string
	  }
	| {
			kind: 'inspection'
			categoryId: string
			scopeId: string
			reason: 'not-priced' | 'not-approved' | 'missing-info' | 'out-of-area' | 'unknown-scope'
			message: string
			missing?: string[]
	  }

export type EstimateInput = {
	categoryId: string
	scopeId: string
	zip: string
	answers: Answers
	aiConfidence: AiConfidence
	/** Show draft prices (preview builds only). */
	previewPrices?: boolean
}

/* ── tiny range helpers ─────────────────────────────────────────── */

type Acc = { mat: [number, number]; lab: [number, number]; other: [number, number] }
const acc = (): Acc => ({ mat: [0, 0], lab: [0, 0], other: [0, 0] })
const rate = () => pricebook.settings.laborRate

function addMat(a: Acc, r: Range, qty: number) {
	a.mat[0] += r[0] * qty
	a.mat[1] += r[1] * qty
}
function addOther(a: Acc, r: Range, qty = 1) {
	a.other[0] += r[0] * qty
	a.other[1] += r[1] * qty
}
/** hours/unit × units × $/hr. Low hours pair with low rate, high with high. */
function addLabor(a: Acc, hours: Range, qty: number, factor = 1) {
	a.lab[0] += hours[0] * qty * factor * rate()[0]
	a.lab[1] += hours[1] * qty * factor * rate()[1]
}

const num = (v: unknown) => {
	const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
	return Number.isFinite(n) ? n : NaN
}
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v))
const round = (n: number, to: number) => Math.round(n / to) * to
const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US')

/* ── per-scope quantity + cost builders ──────────────────────────── */

type Built = { byTier: Tiered<Acc>; quantities: Quantity[]; assumptions: string[]; unsure: number; materialNotes?: Tiered<string> }

function tiered(fn: (t: Tier) => Acc): Tiered<Acc> {
	return { budget: fn('budget'), standard: fn('standard'), premium: fn('premium') }
}

const builders: Record<string, (a: Answers) => Built> = {
	'roof-repair'(a) {
		const p = pricebook.scopes['roof-repair']
		const areas = num(a.repairAreas)
		const steep = str(a.pitch) === 'steep'
		const access = p.access[str(a.stories)] ?? p.access['3']
		return {
			quantities: [{ label: 'Damaged spots', value: areas, unit: 'spots' }],
			assumptions: ['Each spot is up to about 20 sq ft; larger damage is priced on inspection.', 'Decking under each spot is assumed sound.'],
			unsure: str(a.pitch) === 'unknown' ? 1 : 0,
			byTier: tiered((t) => {
				const x = acc()
				addMat(x, p.perArea.material[t], areas)
				addLabor(x, p.perArea.laborHours, areas, steep ? p.steepLaborFactor : 1)
				addOther(x, access)
				addOther(x, p.disposal)
				return x
			}),
		}
	},

	'roof-replace'(a) {
		const p = pricebook.scopes['roof-replace']
		const home = num(a.homeSqft)
		const st = Math.max(1, num(a.stories) || 1)
		const bays = num(a.garageBays) || 0
		const pitchKey = str(a.pitch) || 'unknown'
		const footprint = home / st + bays * p.garageSqftPerBay
		const roofSqft = footprint * (p.pitchFactor[pitchKey] ?? p.pitchFactor.unknown) * p.overhangFactor
		const squares = Math.ceil(roofSqft / 100)
		const steep = pitchKey === 'steep'
		const access = p.access[String(st)] ?? p.access['3']
		return {
			quantities: [
				{ label: 'Estimated roof area', value: Math.round(roofSqft), unit: 'sq ft' },
				{ label: 'Roofing squares', value: squares, unit: 'squares (100 sq ft)' },
			],
			assumptions: [
				`Roof area estimated from home size: ${fmtInt(home)} sq ft ÷ ${st} ${st === 1 ? 'story' : 'stories'}` +
					(bays ? ` + ${bays}-car garage` : '') +
					`, × slope factor, × ${p.overhangFactor} for overhangs.`,
				'Includes tear-off of one existing layer, disposal, and permit.',
				'Rotten decking, extra layers, and code upgrades are found and priced on inspection.',
			],
			unsure: pitchKey === 'unknown' ? 1 : 0,
			materialNotes: p.tierMaterial,
			byTier: tiered((t) => {
				const x = acc()
				addMat(x, p.perSquare.material[t], squares)
				addLabor(x, p.perSquare.installHours[t], squares, steep ? p.steepLaborFactor : 1)
				addLabor(x, p.perSquare.tearOffHours, squares)
				addOther(x, p.perSquare.disposal, squares)
				addOther(x, p.permit)
				addOther(x, access)
				return x
			}),
		}
	},

	'drywall-patch'(a) {
		const p = pricebook.scopes['drywall-patch']
		const s = num(a.smallHoles) || 0
		const m = num(a.mediumHoles) || 0
		const l = num(a.largeHoles) || 0
		const patches = s + m + l
		const textured = str(a.texture) !== 'smooth'
		const paint = str(a.paintTouchup) === 'yes'
		return {
			quantities: [
				{ label: 'Small patches', value: s, unit: 'ea' },
				{ label: 'Medium patches', value: m, unit: 'ea' },
				{ label: 'Large patches', value: l, unit: 'ea' },
			],
			assumptions: [
				'Includes return trips while joint compound dries.',
				textured ? 'Texture matched by hand; an exact match is not guaranteed.' : 'Smooth finish.',
				paint ? 'Patched areas primed and painted to the nearest corner where needed.' : 'Painting not included.',
			],
			unsure: str(a.texture) === 'unknown' ? 1 : 0,
			byTier: tiered((t) => {
				const x = acc()
				const f = p.tierFactor[t]
				for (const [count, spec] of [
					[s, p.patch.small],
					[m, p.patch.medium],
					[l, p.patch.large],
				] as const) {
					addMat(x, spec.material, count * f)
					addLabor(x, spec.hours, count)
				}
				if (textured) addLabor(x, p.textureHoursPerPatch, patches)
				addLabor(x, p.returnTripHours, 1)
				if (paint) {
					addMat(x, p.paintTouchup.materialPerPatch, patches)
					addLabor(x, p.paintTouchup.hoursPerPatch, patches)
				}
				return x
			}),
		}
	},

	'drywall-install'(a) {
		const p = pricebook.scopes['drywall-install']
		const L = num(a.length)
		const W = num(a.width)
		const H = num(a.height)
		const ceiling = str(a.includeCeiling) === 'yes'
		const walls = 2 * (L + W) * H * (1 - p.openingsDeduct)
		const area = walls + (ceiling ? L * W : 0)
		const remove = str(a.removeOld) === 'yes'
		return {
			quantities: [{ label: 'Drywall surface', value: Math.round(area), unit: 'sq ft' }],
			assumptions: [
				`Walls: 2 × (${L} + ${W}) × ${H} ft, less ${Math.round(p.openingsDeduct * 100)}% for doors and windows${ceiling ? ', plus the ceiling' : ''}.`,
				`${Math.round(p.waste * 100)}% board waste included.`,
				remove ? 'Includes removing and hauling away the old drywall.' : 'Framing is assumed ready for board.',
			],
			unsure: 0,
			materialNotes: p.tierMaterial,
			byTier: tiered((t) => {
				const x = acc()
				addMat(x, p.perSqft.material[t], area * (1 + p.waste))
				addLabor(x, p.perSqft.hours[t], area)
				if (remove) {
					addLabor(x, p.removal.hoursPerSqft, area)
					addOther(x, p.removal.disposalPerSqft, area)
				}
				return x
			}),
		}
	},

	'paint-interior'(a) {
		const p = pricebook.scopes['paint-interior']
		const rooms = num(a.rooms)
		const L = num(a.length)
		const W = num(a.width)
		const H = num(a.height)
		const ceilings = str(a.includeCeilings) === 'yes'
		const trim = str(a.includeTrim) === 'yes'
		const walls = rooms * 2 * (L + W) * H * (1 - p.openingsDeduct)
		const ceil = ceilings ? rooms * L * W : 0
		return {
			quantities: [
				{ label: 'Wall area', value: Math.round(walls), unit: 'sq ft' },
				...(ceilings ? [{ label: 'Ceiling area', value: Math.round(ceil), unit: 'sq ft' }] : []),
			],
			assumptions: [
				`${rooms} room${rooms === 1 ? '' : 's'} at about ${L} × ${W} ft, ${H} ft ceilings, less ${Math.round(p.openingsDeduct * 100)}% for doors and windows.`,
				'Two coats; minor nail-hole and crack filling included.',
				'Furniture moved by the owner; wallpaper removal and major repairs are extra.',
			],
			unsure: 0,
			materialNotes: p.tierMaterial,
			byTier: tiered((t) => {
				const x = acc()
				addMat(x, p.perSqft.material[t], walls + ceil)
				addLabor(x, p.perSqft.hours, walls)
				if (ceilings) addLabor(x, p.perSqft.hours, ceil, p.ceilingLaborFactor)
				if (trim) {
					addMat(x, p.trimPerRoom.material, rooms)
					addLabor(x, p.trimPerRoom.hours, rooms)
				}
				return x
			}),
		}
	},

	'paint-exterior'(a) {
		const p = pricebook.scopes['paint-exterior']
		const home = num(a.homeSqft)
		const st = Math.max(1, num(a.stories) || 1)
		const surface = str(a.surface) || 'other'
		const footprint = home / st
		const perimeter = 4 * Math.sqrt(footprint) * p.perimeterShapeFactor
		const area = perimeter * p.storyHeightFt * st * (1 - p.openingsDeduct)
		const access = p.access[String(st)] ?? p.access['3']
		return {
			quantities: [{ label: 'Estimated wall area', value: Math.round(area), unit: 'sq ft' }],
			assumptions: [
				`Wall area estimated from home size: about ${fmtInt(perimeter)} ft of wall, ${p.storyHeightFt} ft per story, less ${Math.round(p.openingsDeduct * 100)}% for doors and windows.`,
				'Pressure wash, caulk, spot-prime, two coats. Wood rot and stucco crack repair are priced on inspection.',
			],
			unsure: surface === 'other' ? 1 : 0,
			materialNotes: p.tierMaterial,
			byTier: tiered((t) => {
				const x = acc()
				addMat(x, p.perSqft.material[t], area * (p.surfaceMaterialFactor[surface] ?? 1.1))
				addLabor(x, p.perSqft.hours, area)
				addOther(x, access)
				return x
			}),
		}
	},

	flooring(a) {
		const p = pricebook.scopes.flooring
		const typeKey = str(a.floorType) as keyof typeof p.types
		const spec = p.types[typeKey]
		const area = num(a.area)
		const removeKey = (str(a.remove) || 'none') as keyof typeof p.removal
		const removal = p.removal[removeKey] ?? p.removal.none
		return {
			quantities: [
				{ label: 'Floor area', value: Math.round(area), unit: 'sq ft' },
				{ label: 'Material with waste', value: Math.ceil(area * (1 + spec.waste)), unit: 'sq ft' },
			],
			assumptions: [
				`${Math.round(spec.waste * 100)}% cutting waste included.`,
				removeKey === 'none' ? 'Floor assumed clear and ready.' : 'Includes removing and hauling away the old flooring.',
				'Minor floor leveling included; major slab repair, stairs, and baseboard replacement are extra.',
			],
			unsure: 0,
			materialNotes: {
				budget: `${spec.label} — economy line`,
				standard: `${spec.label} — mid-grade line`,
				premium: `${spec.label} — premium line`,
			},
			byTier: tiered((t) => {
				const x = acc()
				addMat(x, spec.material[t], area * (1 + spec.waste))
				addLabor(x, spec.hours, area)
				addLabor(x, removal.hours, area)
				addOther(x, removal.disposal, area)
				return x
			}),
		}
	},
}

/* ── public entry point ───────────────────────────────────────────── */

export function estimate(input: EstimateInput): EstimateResult {
	const { categoryId, scopeId } = input
	const base = { categoryId, scopeId }
	const found = findScope(categoryId, scopeId)
	if (!found) return { ...base, kind: 'inspection', reason: 'unknown-scope', message: 'We will look at this one in person.' }

	const zip = (input.zip || '').trim()
	const factor = /^\d{5}$/.test(zip) ? pricebook.settings.regions[zip.slice(0, 3)] : undefined
	if (!factor) {
		return {
			...base,
			kind: 'inspection',
			reason: 'out-of-area',
			message: 'That ZIP code is outside the area we price online. Send it anyway and we will tell you whether we can help.',
		}
	}

	if (!isPricedScope(scopeId) || !builders[scopeId]) {
		return { ...base, kind: 'inspection', reason: 'not-priced', message: 'We price this kind of project after a quick look in person.' }
	}

	const meta = pricebook.scopes[scopeId]
	const approved = meta.status === 'approved'
	if (!approved && !input.previewPrices) {
		return { ...base, kind: 'inspection', reason: 'not-approved', message: 'We price this kind of project after a quick look in person.' }
	}

	const missing = found.scope.questions
		.filter((q) => q.required)
		.filter((q) => {
			const v = input.answers[q.id]
			if (q.type === 'number') {
				const n = num(v)
				return !Number.isFinite(n) || (q.min != null && n < q.min) || (q.max != null && n > q.max)
			}
			return !q.options?.some((o) => o.value === str(v))
		})
		.map((q) => q.label)
	if (missing.length) {
		return { ...base, kind: 'inspection', reason: 'missing-info', message: 'We need a little more information to price this.', missing }
	}

	const built = builders[scopeId](input.answers)

	// A drywall-patch job with zero patches is not a job.
	if (built.quantities.every((q) => !q.value)) {
		return { ...base, kind: 'inspection', reason: 'missing-info', message: 'Tell us how much work there is so we can price it.', missing: [found.scope.questions[0]?.label ?? 'Quantity'] }
	}

	const ai = input.aiConfidence
	const confidence: 'high' | 'medium' | 'low' =
		ai === 'low' || built.unsure >= 2 ? 'low' : ai === 'medium' || ai === 'none' || built.unsure === 1 ? 'medium' : 'high'
	const budgetIndication = confidence === 'low'
	const [spreadLo, spreadHi] = budgetIndication ? pricebook.settings.lowConfidenceSpread : [1, 1]

	const { overheadPct, profitPct, roundTo } = pricebook.settings
	const m = (lo: number, hi: number, to = 10): Money => ({ low: round(lo * factor * spreadLo, to), high: round(hi * factor * spreadHi, to) })

	const tiers: TierResult[] = (['budget', 'standard', 'premium'] as Tier[]).map((tier) => {
		const x = built.byTier[tier]
		const direct = [x.mat[0] + x.lab[0] + x.other[0], x.mat[1] + x.lab[1] + x.other[1]]
		const op = direct.map((d) => d * overheadPct + d * (1 + overheadPct) * profitPct)
		let totalLo = (direct[0] + op[0]) * factor * spreadLo
		let totalHi = (direct[1] + op[1]) * factor * spreadHi
		let minimumApplied = false
		if (totalLo < meta.minimum) {
			totalLo = meta.minimum
			minimumApplied = true
		}
		if (totalHi < meta.minimum) totalHi = meta.minimum
		return {
			tier,
			materialNote: built.materialNotes?.[tier],
			materials: m(x.mat[0], x.mat[1]),
			labor: m(x.lab[0], x.lab[1]),
			other: m(x.other[0], x.other[1]),
			overheadProfit: m(op[0], op[1]),
			total: { low: round(totalLo, roundTo), high: Math.max(round(totalHi, roundTo), round(totalLo, roundTo)) },
			minimumApplied,
		}
	})

	return {
		...base,
		kind: 'priced',
		tiers,
		quantities: built.quantities,
		assumptions: [
			...built.assumptions,
			minimumApplies(tiers) ? `A minimum job charge of $${fmtInt(meta.minimum)} applies.` : '',
			'Excludes sales tax and anything hidden behind walls, under floors, or under the roof covering.',
		].filter(Boolean),
		confidence,
		budgetIndication,
		draftPrices: !approved,
		asOf: meta.asOf,
	}
}

const minimumApplies = (tiers: TierResult[]) => tiers.some((t) => t.minimumApplied)
