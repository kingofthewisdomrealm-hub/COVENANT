/**
 * THE VERO PORCH — a monthly neighborhood paper for Vero Beach, published by
 * Covenant Builders. The printed front page carries a QR code that lands on
 * /porch, which shows the full current issue.
 *
 * RULES FOR EVERY ISSUE
 * 1. It is a newspaper first. Mostly real neighborhood content; Covenant gets
 *    one box. If it reads like an ad it is a "handbill" under Indian River
 *    County §310.02 and Vero Beach §62-32, and the handbill rules apply.
 * 2. Every fact has a source in `sources`. Events change — re-check dates the
 *    week the issue goes to print.
 * 3. Roof copy is a roof advertisement under F.S. §489.147: never mention
 *    filing, handling or maximising an insurance claim, and never attach a
 *    gift, rebate, coupon or deductible promise to the free Report Card.
 *    See the compliance block in content/storm-check.ts.
 * 4. Sponsor name + address must be printed (Indian River County §310.06).
 */

export interface PorchStory {
	slug: string
	kicker: string
	headline: string
	dek: string
	paragraphs: string[]
	list?: { title: string; body: string }[]
}

export interface PorchEvent {
	when: string
	what: string
	where: string
}

export interface PorchIssue {
	slug: string
	volume: number
	number: number
	monthLabel: string
	/** ISO date the facts in this issue were last checked */
	checkedOn: string
	price: string
	lead: PorchStory
	history: PorchStory
	askTheBuilder: PorchStory
	events: PorchEvent[]
	sources: { label: string; url: string }[]
}

export const PORCH_NAME = 'The Vero Porch'
export const PORCH_TAGLINE = 'Neighborhood news for Vero Beach'
export const PORCH_SPONSOR =
	'Published monthly by Covenant Builders · 876 47th Avenue, Vero Beach, FL 32966 · Florida Certified Building Contractor CBC1253676'

export const porchIssues: PorchIssue[] = [
	{
		slug: '2026-10',
		volume: 1,
		number: 1,
		monthLabel: 'October 2026',
		checkedOn: '2026-10-08',
		price: '$1 · Free to Vero Beach residents',
		lead: {
			slug: 'six-weeks-left',
			kicker: 'Storm season',
			headline: 'Six weeks left in hurricane season. Here are five checks for this month.',
			dek: 'The Atlantic season runs June 1 to November 30. October storms still happen, and most of these checks take an afternoon and cost nothing.',
			paragraphs: [
				'Most of us stop thinking about hurricanes once the kids are back in school. The calendar says otherwise: the season does not close until November 30. A quiet Saturday this month is the cheapest time to find a problem, because nobody is booked solid yet.',
				'None of these need a ladder. Do them from the ground, the garage and the attic hatch.',
			],
			list: [
				{
					title: 'Walk the roof line from the yard',
					body: 'Look for shingles that are lifted, curled, cracked or missing, and for metal flashing pulling away from walls. Binoculars help.',
				},
				{
					title: 'Clear the gutters and downspouts',
					body: 'Water that backs up during a downpour soaks the fascia and finds its way into the walls.',
				},
				{
					title: 'Find your shutter hardware now',
					body: 'Count the panels, wing nuts and anchors, and test one opening. The middle of a storm warning is a bad time to find a missing bolt.',
				},
				{
					title: 'Check the garage door',
					body: 'It is the biggest opening on most houses. Look for a wind-rating label and any bracing, and note what you find.',
				},
				{
					title: 'Take dated photos of your house',
					body: 'Every side, the roof from the street, windows, doors, fence and equipment labels. Keep them somewhere other than your phone. A before-the-storm record of your home is worth having for your own files.',
				},
			],
		},
		history: {
			slug: 'why-vero',
			kicker: 'Vero then',
			headline: 'Why we are called Vero',
			dek: 'A Latin word, a pioneer family and a 1925 trip to Tallahassee.',
			paragraphs: [
				'In 1887 pioneer Henry T. Gifford built a house near where City Hall stands today. He ran a citrus grove and opened the settlement’s first store, which also served as the post office and the railroad ticket office once the Jacksonville, St. Augustine and Indian River Railroad arrived in 1893.',
				'His wife, Sarah, is credited with the name. "Vero" comes from the Latin for truth, and the city still describes it as meaning "to speak the truth."',
				'The Indian River Farms Company bought 44,000 acres in 1912 and adopted the final plat of the original Town of Vero in 1913. Vero incorporated as a city in 1919. In 1925 local leaders lobbied Tallahassee to create Indian River County; Vero became the county seat, re-incorporated, and took the name Vero Beach.',
				'After World War II the Brooklyn Dodgers made the former Naval Air Station their spring training home in 1947. Historic Dodgertown shares that land with the Vero Beach airport today.',
			],
		},
		askTheBuilder: {
			slug: 'roof-age',
			kicker: 'Ask the builder',
			headline: '"Why does my insurance company keep asking how old my roof is?"',
			dek: 'Because roof age is one of the first things an insurer looks at when it writes or renews a Florida policy.',
			paragraphs: [
				'If you do not know your roof’s age, you are not alone. Many homes have changed hands since the last reroof, and the paperwork went with the previous owner.',
				'The building permit record usually has the answer. Reroofs need a permit, so the date of the last one is a good clue. In the City of Vero Beach that is the city building department; outside city limits it is Indian River County.',
				'Have a question about your house? Text it to (772) 473-7115 and we may answer it in a future issue.',
			],
		},
		events: [
			{ when: 'Saturdays, 8 a.m.–noon', what: 'Farmers Market Oceanside', where: 'Ocean Drive & Dahlia Lane' },
			{ when: 'Oct 15 – Nov 22', what: 'My Vaudeville Man! opens the mainstage season', where: 'Riverside Theatre' },
			{ when: 'Oct 16 – 18', what: 'Vero Beach Oktoberfest', where: 'Indian River County Fairgrounds, 7955 58th Ave' },
			{ when: 'Fri, Oct 30, 6–9 p.m.', what: 'Downtown Friday, season opener', where: '14th Avenue, downtown' },
			{ when: 'Nov 21', what: 'Holiday Art & Craft Expo', where: 'Indian River County Fairgrounds' },
			{ when: 'Nov 21 – Feb 7', what: 'Hokusai, Hiroshige, Hasui: Japanese Landscapes in Print', where: 'Vero Beach Museum of Art' },
			{ when: 'Fri, Nov 27', what: 'Downtown Friday', where: '14th Avenue, downtown' },
			{ when: 'Nov 29 – Jan 2', what: 'McKee Jungle Lights', where: 'McKee Botanical Garden' },
		],
		sources: [
			{ label: 'City of Vero Beach — History of Vero Beach', url: 'https://www.covb.org/359/History-of-Vero-Beach' },
			{ label: 'Visit Indian River County — Fall Events 2026', url: 'https://visitindianrivercounty.com/blog/fall-events-in-indian-river-county-2026/' },
			{ label: 'Renny Realty — Vero Beach Fall Events 2026', url: 'https://rennyrealty.com/blog/vero-beachs-fall-doesnt-start-all-at-once-heres-the-order-it-comes-back' },
			{ label: 'NOAA National Hurricane Center', url: 'https://www.nhc.noaa.gov/' },
		],
	},
]

export const currentPorchIssue = porchIssues[0]

/** Where the printed QR code points. utm tags let the attribution page count scans. */
export const PORCH_QR_URL =
	'https://covenantbuilders.org/porch?utm_source=vero-porch&utm_medium=print&utm_campaign=porch-2026-10'
