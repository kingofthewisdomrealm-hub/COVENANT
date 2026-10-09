/**
 * PHOTO ESTIMATOR — THE PRICEBOOK.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  EVERY NUMBER IN THIS FILE IS A DRAFT.                                │
 * │  They were set on 9 Oct 2026 as reasonable starting points so the     │
 * │  engine can be tested. They are NOT Covenant Builders' job costs and  │
 * │  NOT live supplier prices.                                            │
 * │                                                                       │
 * │  A scope is only priced on the public site when its `status` is       │
 * │  'approved'. While it is 'draft', the public page says "priced after  │
 * │  a quick look" and only preview builds (ESTIMATOR_PREVIEW_PRICES=1)   │
 * │  show the numbers — under a red DRAFT PRICES banner.                  │
 * │                                                                       │
 * │  To approve a scope: replace its numbers with yours, set `status` to  │
 * │  'approved', set `reviewedBy` and `asOf`. That is the whole process.  │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Cross-check used while drafting (national averages, no ZIP, May 2026,
 * excluding GC markup — homewyse.com): drywall installed $2.26–$2.69/sq ft;
 * asphalt shingle roof $5.09–$6.66/sq ft. The draft rates land near those
 * once overhead and profit are added. Treat that as a sanity check only.
 *
 * Units: money in US dollars. Ranges are [low, high]. Labor is in HOURS per
 * unit and is multiplied by settings.laborRate — change the rate once and
 * every scope moves with it.
 */

export type Range = readonly [number, number]
export type Tiered<T> = { budget: T; standard: T; premium: T }
export type PriceStatus = 'draft' | 'approved'

type Meta = {
	status: PriceStatus
	asOf: string
	reviewedBy: string | null
	/** Smallest customer price for this scope (compared with the final total). */
	minimum: number
}

export const pricebook = {
	asOf: '2026-10-09',
	source: 'DRAFT starting values — replace with Covenant job costs before approving',

	settings: {
		/** Blended crew labor cost per hour, low–high. */
		laborRate: [50, 70] as Range,
		overheadPct: 0.1,
		profitPct: 0.15,
		/** Round customer-facing totals to this many dollars. */
		roundTo: 50,
		/**
		 * ZIP prefixes we serve and their cost factor. 329 = Indian River +
		 * south Brevard, 349 = St. Lucie / Martin. Anything else is "out of
		 * area": no price, we confirm by phone.
		 */
		regions: { '329': 1.0, '349': 1.0 } as Record<string, number>,
		/** When photos/answers are uncertain the range widens by this much. */
		lowConfidenceSpread: [0.85, 1.25] as Range,
	},

	scopes: {
		'roof-repair': {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 650,
			perArea: {
				material: { budget: [120, 180], standard: [160, 240], premium: [220, 320] } as Tiered<Range>,
				laborHours: [4, 6] as Range,
			},
			/** Extra equipment/access cost per job by stories. */
			access: { '1': [0, 0], '2': [100, 200], '3': [250, 450] } as Record<string, Range>,
			steepLaborFactor: 1.25,
			disposal: [75, 125] as Range,
		},
		'roof-replace': {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 6500,
			/** Per roofing square (100 sq ft of roof surface). */
			perSquare: {
				material: { budget: [170, 220], standard: [230, 290], premium: [550, 750] } as Tiered<Range>,
				installHours: { budget: [1.5, 2.0], standard: [1.6, 2.1], premium: [3.0, 4.0] } as Tiered<Range>,
				tearOffHours: [0.8, 1.0] as Range,
				disposal: [35, 50] as Range,
			},
			tierMaterial: {
				budget: 'Architectural shingle system',
				standard: 'Premium high-wind architectural shingle system',
				premium: 'Standing-seam metal system',
			},
			pitchFactor: { low: 1.03, standard: 1.15, steep: 1.3, unknown: 1.15 } as Record<string, number>,
			steepLaborFactor: 1.25,
			overhangFactor: 1.1,
			garageSqftPerBay: 240,
			access: { '1': [0, 0], '2': [300, 500], '3': [600, 900] } as Record<string, Range>,
			permit: [400, 700] as Range,
		},
		'drywall-patch': {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 300,
			patch: {
				small: { material: [10, 15] as Range, hours: [0.75, 1.0] as Range },
				medium: { material: [25, 40] as Range, hours: [1.5, 2.5] as Range },
				large: { material: [60, 90] as Range, hours: [3.0, 4.0] as Range },
			},
			textureHoursPerPatch: [0.25, 0.4] as Range,
			/** Mud has to dry: return trips are real labor. */
			returnTripHours: [2, 3] as Range,
			paintTouchup: { materialPerPatch: [8, 15] as Range, hoursPerPatch: [0.3, 0.5] as Range },
			tierFactor: { budget: 0.9, standard: 1.0, premium: 1.2 },
		},
		'drywall-install': {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 900,
			perSqft: {
				material: { budget: [0.85, 1.1], standard: [1.05, 1.35], premium: [1.15, 1.45] } as Tiered<Range>,
				hours: { budget: [0.022, 0.026], standard: [0.022, 0.026], premium: [0.03, 0.035] } as Tiered<Range>,
			},
			tierMaterial: {
				budget: '1/2" standard board, level 4 finish',
				standard: 'Moisture/mold-resistant board, level 4 finish',
				premium: 'Moisture/mold-resistant board, level 5 smooth finish',
			},
			openingsDeduct: 0.1,
			waste: 0.12,
			removal: { hoursPerSqft: [0.01, 0.014] as Range, disposalPerSqft: [0.12, 0.2] as Range },
		},
		'paint-interior': {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 400,
			perSqft: {
				material: { budget: [0.22, 0.28], standard: [0.33, 0.41], premium: [0.46, 0.56] } as Tiered<Range>,
				hours: [0.011, 0.015] as Range,
			},
			tierMaterial: {
				budget: 'Contractor-grade paint, 2 coats',
				standard: 'Mid-grade washable paint, 2 coats',
				premium: 'Premium scrubbable paint, 2 coats',
			},
			openingsDeduct: 0.15,
			ceilingLaborFactor: 1.2,
			trimPerRoom: { material: [12, 20] as Range, hours: [1.25, 1.75] as Range },
		},
		'paint-exterior': {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 1500,
			perSqft: {
				material: { budget: [0.3, 0.4], standard: [0.4, 0.55], premium: [0.65, 0.85] } as Tiered<Range>,
				hours: [0.012, 0.018] as Range,
			},
			tierMaterial: {
				budget: 'Exterior acrylic, 2 coats',
				standard: 'Premium exterior acrylic, 2 coats',
				premium: 'Elastomeric coating system',
			},
			surfaceMaterialFactor: { stucco: 1.2, siding: 1.0, other: 1.1 } as Record<string, number>,
			storyHeightFt: 9,
			perimeterShapeFactor: 1.15,
			openingsDeduct: 0.15,
			access: { '1': [75, 150], '2': [300, 500], '3': [600, 900] } as Record<string, Range>,
		},
		flooring: {
			status: 'draft' as PriceStatus,
			asOf: '2026-10-09',
			reviewedBy: null,
			minimum: 600,
			types: {
				vinyl: {
					label: 'Vinyl plank',
					material: { budget: [2.0, 2.75], standard: [3.0, 4.0], premium: [4.5, 6.0] } as Tiered<Range>,
					hours: [0.035, 0.045] as Range,
					waste: 0.1,
				},
				laminate: {
					label: 'Laminate',
					material: { budget: [1.5, 2.25], standard: [2.5, 3.5], premium: [4.0, 5.0] } as Tiered<Range>,
					hours: [0.035, 0.045] as Range,
					waste: 0.1,
				},
				tile: {
					label: 'Porcelain tile',
					material: { budget: [2.75, 3.75], standard: [4.25, 6.0], premium: [6.75, 10.0] } as Tiered<Range>,
					hours: [0.1, 0.14] as Range,
					waste: 0.12,
				},
				hardwood: {
					label: 'Engineered hardwood',
					material: { budget: [4.0, 5.5], standard: [6.0, 8.0], premium: [9.0, 12.0] } as Tiered<Range>,
					hours: [0.05, 0.07] as Range,
					waste: 0.1,
				},
			},
			removal: {
				none: { hours: [0, 0] as Range, disposal: [0, 0] as Range },
				carpet: { hours: [0.008, 0.012] as Range, disposal: [0.1, 0.18] as Range },
				vinyl: { hours: [0.012, 0.018] as Range, disposal: [0.12, 0.2] as Range },
				tile: { hours: [0.035, 0.05] as Range, disposal: [0.25, 0.45] as Range },
			},
		},
	} satisfies Record<string, Meta & Record<string, unknown>>,
}

export type PricedScopeId = keyof typeof pricebook.scopes

export const isPricedScope = (id: string): id is PricedScopeId => id in pricebook.scopes
