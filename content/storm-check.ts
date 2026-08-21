/**
 * Data and copy for the /storm-check hail & wind damage quiz.
 *
 * EDITORIAL RULES — inherited from content/design-your-project.ts.
 * 1. No invented numbers. No repair costs, no claim amounts, no "average
 *    payout". The licence number is the authority, not adjectives.
 * 2. The visitor is the hero. This page helps a homeowner find out whether
 *    a storm actually touched their roof, in plain words, before anyone
 *    climbs a ladder.
 * 3. THIS PAGE IS A ROOF ADVERTISEMENT UNDER FLORIDA LAW. Read the
 *    compliance block at the bottom before changing any wording.
 */

import { STORM_INSURANCE_NOTICE } from './design-your-project'

export { STORM_INSURANCE_NOTICE }

/**
 * Recorded storm events the quiz can match a ZIP code against.
 *
 * EVERY ENTRY NEEDS AN OFFICIAL SOURCE — a National Weather Service / Storm
 * Prediction Center report, not a roofing blog, not a neighbour, not a
 * marketing roundup. The quiz shows the event to the visitor as a fact, so
 * the fact has to be checkable. If you cannot cite it, do not add it.
 *
 * Counties use the keys in ZIP_COUNTIES below. Add new events at the top.
 */
export interface StormEvent {
	/** ISO date, e.g. 2025-05-05 */
	date: string
	label: string
	kind: 'hail' | 'wind' | 'hurricane'
	/** What the official report recorded, in the report's own terms. */
	detail: string
	counties: readonly CountyKey[]
	source: string
}

export type CountyKey =
	| 'indian-river'
	| 'st-lucie'
	| 'martin'
	| 'palm-beach'
	| 'okeechobee'
	| 'brevard'

export const COUNTY_NAMES: Record<CountyKey, string> = {
	'indian-river': 'Indian River County',
	'st-lucie': 'St. Lucie County',
	martin: 'Martin County',
	'palm-beach': 'Palm Beach County',
	okeechobee: 'Okeechobee County',
	brevard: 'Brevard County',
}

export const stormEvents: readonly StormEvent[] = [
	{
		date: '2025-05-05',
		label: 'May 5, 2025 hailstorm',
		kind: 'hail',
		detail:
			'Public reports of 2-inch (hen egg) hail near Lawnwood Stadium in Fort Pierce, and quarter-size hail with 52 mph gusts in Wellington.',
		counties: ['st-lucie', 'palm-beach'],
		source:
			'National Weather Service Melbourne storm reports via the Storm Prediction Center, May 5, 2025',
	},
	{
		date: '2024-10-09',
		label: 'Hurricane Milton',
		kind: 'hurricane',
		detail:
			'Tornadoes and hurricane-force gusts across the Treasure Coast on October 9, 2024.',
		counties: ['indian-river', 'st-lucie', 'martin', 'palm-beach', 'okeechobee', 'brevard'],
		source: 'National Weather Service Melbourne, Hurricane Milton impacts summary',
	},
] as const

/**
 * ZIP code → county for the area the quiz serves.
 *
 * Deliberately coarse. A handful of ZIPs straddle county lines; the quiz
 * also asks the city, and the estimator confirms the address on the phone.
 * Anything not listed here resolves to null and the quiz still works — it
 * just cannot match an event, and says so honestly.
 */
export function countyForZip(zip: string): CountyKey | null {
	const z = Number(zip)
	if (!Number.isInteger(z) || zip.length !== 5) return null
	if (z === 32948 || z === 32957 || z === 32958) return 'indian-river'
	if (z >= 32960 && z <= 32978) return 'indian-river'
	if (z >= 32901 && z <= 32959) return 'brevard'
	if (z >= 34945 && z <= 34954) return 'st-lucie'
	if (z >= 34981 && z <= 34988) return 'st-lucie'
	if (z === 34956 || z === 34957 || z === 33455) return 'martin'
	if (z >= 34990 && z <= 34997) return 'martin'
	if (z >= 34972 && z <= 34974) return 'okeechobee'
	if (z >= 33401 && z <= 33498) return 'palm-beach'
	return null
}

export function eventsForZip(zip: string): StormEvent[] {
	const county = countyForZip(zip)
	if (!county) return []
	return stormEvents.filter((event) => event.counties.includes(county))
}

export const propertyOptions = [
	'Single-family home',
	'Condo or townhouse',
	'Association building',
	'Commercial building',
] as const

export const noticedOptions = [
	'After the May 2025 hailstorm',
	'After a storm this summer',
	'After Hurricane Milton (Oct 2024)',
	'Not sure — I just want it checked',
] as const

/**
 * What the visitor can see from the ground. Each sign carries a weight.
 * These are the standard field indicators an inspector checks first — soft
 * metals (gutters, AC fins, screens) take hail marks long before a roof
 * shows them from the street.
 */
export const damageSigns = [
	{ label: 'Dents in gutters or downspouts', points: 20 },
	{ label: 'Dents in the AC unit’s metal fins', points: 20 },
	{ label: 'Dings on window screens, mailbox or metal trim', points: 15 },
	{ label: 'Shingle granules piling in gutters or at downspouts', points: 10 },
	{ label: 'Missing, lifted or creased shingles', points: 20 },
	{ label: 'Cracked or slipped roof tiles', points: 20 },
	{ label: 'Ceiling stains, drips or a leak', points: 25 },
	{ label: 'Dents in fence, siding or pool cage', points: 10 },
	{ label: 'Nothing yet — I have not looked closely', points: 0 },
] as const

export const roofAgeOptions = [
	'Under 5 years',
	'5–10 years',
	'10–15 years',
	'15–20 years',
	'Over 20 years',
	'I’m not sure',
] as const

export const roofTypeOptions = [
	'Asphalt shingle',
	'Concrete or clay tile',
	'Metal',
	'Flat / modified bitumen',
	'I’m not sure',
] as const

export const lookedOptions = [
	'No one yet',
	'A contractor',
	'Someone from my insurance company',
	'I looked myself',
] as const

export const goalOptions = [
	'I just want to know if there is damage',
	'I want it repaired soon',
	'I need help deciding what to do',
] as const

export type Band = 'likely' | 'possible' | 'low'

export interface ScoreInput {
	zip: string
	signs: readonly string[]
	roofAge: string
	noticed: string
}

export function scoreStormCheck(input: ScoreInput): {
	score: number
	band: Band
	events: StormEvent[]
} {
	const events = eventsForZip(input.zip)
	let score = 0
	for (const sign of damageSigns) {
		if (input.signs.includes(sign.label)) score += sign.points
	}
	if (events.length > 0) score += 15
	if (input.roofAge === '15–20 years' || input.roofAge === 'Over 20 years') {
		score += 10
	}
	if (input.noticed !== 'Not sure — I just want it checked') score += 5
	const band: Band = score >= 50 ? 'likely' : score >= 25 ? 'possible' : 'low'
	return { score: Math.min(score, 100), band, events }
}

export const bandCopy: Record<Band, { title: string; body: string }> = {
	likely: {
		title: 'Your answers point to damage worth inspecting now.',
		body: 'The signs you checked are the ones an inspector looks for first. Hail and wind damage that goes unrepaired lets water in a little at a time, and the repair grows with every rain. The next step is a licensed contractor on the roof, not a guess from the street.',
	},
	possible: {
		title: 'There may be something there. It is worth a look.',
		body: 'Some of what you described can be storm damage and some of it can be ordinary wear. The only honest way to tell the difference is to get on the roof and look. That is a free visit, and you will get a written answer either way.',
	},
	low: {
		title: 'Nothing you described points strongly to storm damage.',
		body: 'That is good news. If a storm did pass over your area, the soft metals around the house — gutters, AC fins, screens — usually show marks first. Walk the property once after the next storm and come back to this check if you see any.',
	},
}

/**
 * COMPLIANCE — DO NOT EDIT WITHOUT READING THIS.
 *
 * This quiz is an advertisement for roof repair services. Two Florida statutes
 * shape every sentence on it:
 *
 * F.S. §489.147 — a contractor may not advertise in a way that encourages a
 * consumer to contact the contractor to FILE A ROOF INSURANCE CLAIM (that
 * triggers a mandatory 12-point disclosure), and may not offer a rebate, gift,
 * gift card, coupon, deductible waiver or "no out-of-pocket" promise in
 * connection with a roof inspection. Up to $10,000 per violation. This page
 * avoids the trigger the same way the project designer does: it never
 * mentions filing, handling, helping with, or maximising a claim, and the
 * free inspection comes with nothing attached.
 *
 * F.S. §626.854(16) — no public adjusting. The only insurance sentence on the
 * page is STORM_INSURANCE_NOTICE, imported from the project designer.
 *
 * Never add: "we work with all insurance companies", "insurance may cover
 * this", "free roof if your claim is approved", any dollar figure, or any
 * question about the visitor's deductible or claim amount.
 */
export const STORM_CHECK_DISCLAIMER =
	'This storm check is an informational screening based on what you told us, not an inspection, quote, bid, offer or contract. It does not determine whether damage exists or what caused it. Only an on-site inspection by a licensed contractor can do that. Using this tool does not create a contract.'
