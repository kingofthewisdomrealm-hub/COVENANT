/**
 * Data and copy for the /design-your-project guided project designer.
 *
 * EDITORIAL RULES — same as content/site.ts, and they matter more here.
 * 1. No invented numbers. No square footages, budgets, timelines, project
 *    counts, or testimonials that cannot be verified. The licence number does
 *    more work than any adjective would.
 * 2. The customer is the hero. If a sentence starts talking about Covenant's
 *    journey instead of the reader's problem, cut it.
 * 3. The storm branch is a legal document, not marketing copy. See
 *    STORM_INSURANCE_NOTICE below and read the comment above it before
 *    changing a single word of that branch.
 * 4. The direct call to action reads 'Design your project' everywhere on the
 *    site. Do not reword it on one page — the repetition is the mechanism.
 */

/**
 * Master switch for on-screen budget ranges.
 *
 * OFF deliberately. Turning this on means publishing price ranges, which is
 * an 'advertisement' under Rule 61G4-12.011(3) F.A.C. and carries FDUTPA
 * exposure if the numbers are wrong. Do not flip it until the bands have been
 * checked against Covenant's own closed jobs and signed off in writing.
 * Seed data and sourcing live in docs/design-your-project-plan.md.
 */
export const showPlanningRanges = false

export type BranchKey =
	| 'new-home'
	| 'remodel'
	| 'kitchen'
	| 'commercial'
	| 'condo'
	| 'storm'
	| 'unsure'

export interface ProjectBranch {
	key: BranchKey
	label: string
	blurb: string
	/** Must be one of the `projectTypes` values in content/site.ts — the CRM
	 *  RPC rejects any category outside the job_category enum. */
	crmCategory: string
	propertyQuestion: string
	propertyHelp: string
	propertyOptions: readonly string[]
	scopeQuestion: string
	scopeHelp: string
	scopeOptions: readonly string[]
	sizeOptions: readonly string[]
	/** Condo work is scoped from the building and the board's decision stage,
	 *  not from a finish level. */
	usesFinishLevel: boolean
	/** Hidden from the tile grid; reached by the 'not sure yet' link. */
	hidden?: boolean
}

const RESIDENTIAL_PROPERTY = [
	'Single-family home',
	'Condo or townhouse unit',
	'Waterfront or barrier-island property',
	'Investment or rental property',
] as const

const RESIDENTIAL_SIZE = [
	'Under 500 sq ft',
	'500–1,500 sq ft',
	'1,500–2,500 sq ft',
	'2,500–4,000 sq ft',
	'4,000+ sq ft',
	'I’m not sure',
] as const

export const projectBranches: readonly ProjectBranch[] = [
	{
		key: 'new-home',
		label: 'Build a new home',
		blurb: 'Ground-up construction',
		crmCategory: 'new-home',
		propertyQuestion: 'Where would it go?',
		propertyHelp: 'What’s there now shapes almost everything that comes next.',
		propertyOptions: [
			'Land I already own',
			'Land I’m buying',
			'Still looking for land',
			'Tearing down and rebuilding',
		],
		scopeQuestion: 'What should we plan for?',
		scopeHelp: 'Check everything you’re thinking about. Nothing here commits you to it.',
		scopeOptions: [
			'Design / architectural plans',
			'Site work & clearing',
			'Foundation',
			'Shell & framing',
			'Roof',
			'Impact windows & doors',
			'Full interior finish',
			'Kitchen & cabinetry',
			'Pool / outdoor living',
			'Dock or seawall',
		],
		sizeOptions: [
			'Under 1,500 sq ft',
			'1,500–2,500 sq ft',
			'2,500–4,000 sq ft',
			'4,000–6,000 sq ft',
			'6,000+ sq ft',
			'I’m not sure',
		],
		usesFinishLevel: true,
	},
	{
		key: 'remodel',
		label: 'Remodel or add on',
		blurb: 'Renovations and additions',
		crmCategory: 'remodel',
		propertyQuestion: 'Tell us about the property.',
		propertyHelp: 'What’s there now shapes almost everything that comes next.',
		propertyOptions: RESIDENTIAL_PROPERTY,
		scopeQuestion: 'What’s included?',
		scopeHelp: 'Check everything you’re thinking about. Nothing here commits you to it.',
		scopeOptions: [
			'Kitchen',
			'Primary bath',
			'Additional baths',
			'Whole-house refresh',
			'Room addition',
			'Second-storey addition',
			'Flooring',
			'Impact windows & doors',
			'Roof',
			'Opening up walls / layout change',
			'Aging-in-place (curbless shower, wider doors, ramp)',
		],
		sizeOptions: RESIDENTIAL_SIZE,
		usesFinishLevel: true,
	},
	{
		key: 'kitchen',
		label: 'Kitchen & cabinetry',
		blurb: 'Custom cabinetry and kitchens',
		crmCategory: 'kitchen',
		propertyQuestion: 'Tell us about the property.',
		propertyHelp: 'What’s there now shapes almost everything that comes next.',
		propertyOptions: RESIDENTIAL_PROPERTY,
		scopeQuestion: 'What’s included?',
		scopeHelp: 'Check everything you’re thinking about. Nothing here commits you to it.',
		scopeOptions: [
			'Cabinetry',
			'Countertops',
			'Appliances',
			'Island / layout change',
			'Flooring',
			'Lighting & electrical',
			'Plumbing relocation',
			'Wall removal',
		],
		sizeOptions: [
			'Galley or small kitchen',
			'Standard kitchen',
			'Large / open-plan kitchen',
			'Kitchen plus adjoining rooms',
			'I’m not sure',
		],
		usesFinishLevel: true,
	},
	{
		key: 'commercial',
		label: 'Commercial space',
		blurb: 'Build-outs and tenant improvements',
		crmCategory: 'commercial',
		propertyQuestion: 'What kind of space is it?',
		propertyHelp: 'This tells us which code path and inspection sequence applies.',
		propertyOptions: [
			'Retail',
			'Office',
			'Restaurant or hospitality',
			'Warehouse or light industrial',
			'Multi-family',
		],
		scopeQuestion: 'What’s included?',
		scopeHelp: 'Check everything you’re thinking about. Nothing here commits you to it.',
		scopeOptions: [
			'Ground-up build',
			'Interior build-out',
			'Tenant improvement',
			'ADA upgrades',
			'Impact / storefront glazing',
			'Roof',
			'MEP upgrades',
		],
		sizeOptions: [
			'Under 1,500 sq ft',
			'1,500–5,000 sq ft',
			'5,000–15,000 sq ft',
			'15,000+ sq ft',
			'I’m not sure',
		],
		usesFinishLevel: true,
	},
	{
		key: 'condo',
		label: 'Condo or association building',
		blurb: 'Milestone, SIRS, structural repair',
		crmCategory: 'commercial',
		propertyQuestion: 'Tell us about the building.',
		propertyHelp: 'Building size drives sequencing, access, and how the work is staged.',
		propertyOptions: [
			'10–30 units',
			'30–100 units',
			'100+ units',
			'I’m not sure yet',
		],
		scopeQuestion: 'What does the building need?',
		scopeHelp: 'Check everything under discussion, even if the board hasn’t decided.',
		scopeOptions: [
			'Milestone Phase 1 findings',
			'Milestone Phase 2 repairs',
			'SIRS-identified work',
			'Spalled concrete repair',
			'Balcony restoration',
			'Waterproofing & coatings',
			'Railings',
			'Roof',
			'Impact window/door replacement',
			'Common-area interior',
		],
		sizeOptions: [],
		usesFinishLevel: false,
	},
	{
		key: 'storm',
		label: 'Storm damage repair',
		blurb: 'Repairs after wind or water damage',
		crmCategory: 'storm-restoration',
		propertyQuestion: 'What kind of property is it?',
		propertyHelp: 'What’s there now shapes almost everything that comes next.',
		propertyOptions: [
			'Single-family home',
			'Condo unit',
			'Association building',
			'Commercial building',
		],
		scopeQuestion: 'What storm damage are you dealing with?',
		scopeHelp: 'Tell us what’s broken and we’ll scope the repair.',
		scopeOptions: [
			'Roof',
			'Windows & doors',
			'Water intrusion / interior',
			'Structural',
			'Soffit & fascia',
			'Full rebuild',
		],
		sizeOptions: RESIDENTIAL_SIZE,
		usesFinishLevel: false,
	},
	{
		key: 'unsure',
		label: 'Not sure yet — help me figure it out',
		blurb: '',
		crmCategory: 'other',
		propertyQuestion: 'Tell us about the property.',
		propertyHelp: 'Start with what’s there now. We’ll work out the rest together.',
		propertyOptions: RESIDENTIAL_PROPERTY,
		scopeQuestion: 'What’s on your mind?',
		scopeHelp: 'Check anything that sounds close. Guessing is fine at this stage.',
		scopeOptions: [
			'Kitchen',
			'Bathrooms',
			'Room addition',
			'Whole-house refresh',
			'Impact windows & doors',
			'Roof',
			'Storm or water damage',
			'Something structural',
			'I really don’t know yet',
		],
		sizeOptions: RESIDENTIAL_SIZE,
		usesFinishLevel: true,
		hidden: true,
	},
] as const

export const finishLevels = [
	{
		value: 'Practical',
		description:
			'Durable, code-plus, sensible materials. Built to last, not to impress.',
	},
	{
		value: 'Refined',
		description:
			'Where most Vero Beach homes land. Better cabinetry, better tile, better fixtures.',
	},
	{
		value: 'Custom',
		description: 'Bespoke millwork, specified finishes, architectural detail.',
	},
] as const

export const boardStages = [
	'Gathering information',
	'Engineer’s report in hand',
	'Budgeting the assessment',
	'Ready to bid',
	'Under a compliance deadline',
] as const

export const timelineOptions = [
	'As soon as possible',
	'1–3 months',
	'3–6 months',
	'6–12 months',
	'Just planning for now',
] as const

export const budgetBands = [
	'Under $25K',
	'$25K–$75K',
	'$75K–$150K',
	'$150K–$400K',
	'$400K–$1M',
	'Over $1M',
	'I’d rather discuss it',
] as const

/**
 * COMPLIANCE — DO NOT EDIT WITHOUT READING THIS.
 *
 * F.S. §626.854(16): a contractor may not advertise, solicit, offer to handle,
 * handle, or perform public adjuster services without a public adjuster
 * licence. Discussing repair bids and telling an owner to contact their own
 * carrier is the safe harbour, and this sentence is it.
 *
 * F.S. §489.147: any advertisement encouraging a consumer to contact a
 * contractor to file a ROOF insurance claim must carry a deductible/fraud
 * disclosure in a font at least 12 points and at least half the size of the
 * largest font used. This page avoids the trigger entirely by never
 * encouraging a claim. Penalty is up to $10,000 per violation.
 *
 * Never add to the storm branch: anything about filing, helping with,
 * handling, or maximising a claim; 'no out-of-pocket cost'; 'we work with all
 * insurance companies'; or any free inspection paired with a gift, gift card,
 * coupon, rebate, or deductible assistance (§489.147, §626.854(23)).
 */
export const STORM_INSURANCE_NOTICE =
	'We provide repair estimates. For questions about your coverage or your deductible, contact your insurance carrier directly.'

/**
 * Required on the results screen and on every emailed or downloaded brief.
 * F.S. §489.119(5)(b) and Rule 61G4-12.011(3) F.A.C. treat an offer of
 * services in any electronic medium as advertising, so the certification
 * number has to travel with the output — the site footer is not enough.
 */
export const BRIEF_DISCLAIMER =
	'This project brief is a planning document, not a quote, bid, offer, or contract. Any figures shown are non-binding planning ranges based on typical regional costs and do not account for site conditions, permits, allowances, or change orders. Pricing requires a site visit and a written scope. Using this tool does not create a contract.'
