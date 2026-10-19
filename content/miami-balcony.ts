/**
 * THE MIAMI BALCONY — a monthly neighborhood paper for homeowners and condo
 * owners in the City of Miami Beach, published by Covenant Builders. Its own
 * paper: it never shares stories with The Vero Porch, The Sebastian Porch,
 * The PSL Porch or The Orlando Balcony.
 * Same house rules (read the header of content/porch.ts before editing):
 *
 * 1. Newspaper first; Covenant gets one box. Sponsor name + address printed.
 * 2. Every fact has a source in `sources`. Re-check event dates the week it prints.
 * 3. Roof copy follows F.S. §489.147 — no claim talk, no gifts or rebates.
 * 4. Homeowner news only. Elections and ballot items: facts and dates, never a
 *    recommendation.
 * 5. Miami Beach only: the City of Miami Beach (South Beach, Mid-Beach, North
 *    Beach), plus Miami-Dade County news when it lands on Miami Beach homes.
 *    Not the City of Miami, North Miami Beach, Surfside, Bal Harbour or other
 *    cities — and never Treasure Coast or Orlando news.
 */

import type { PorchIssue } from '@/content/porch'

export const MIAMI_BALCONY_NAME = 'The Miami Balcony'
export const MIAMI_BALCONY_TAGLINE = 'Neighborhood news for Miami Beach homeowners'
export const MIAMI_BALCONY_SPONSOR =
	'Published monthly by Covenant Builders · 876 47th Avenue, Vero Beach, FL 32966 · Florida Certified Building Contractor CBC1253676'

export const miamiBalconyIssues: PorchIssue[] = [
	{
		slug: '2026-10',
		volume: 1,
		number: 1,
		monthLabel: 'October 2026',
		checkedOn: '2026-10-19',
		price: '$1 · Free to Miami Beach residents',
		lead: {
			slug: 'king-tide-free-garage-parking',
			kicker: 'King tides',
			headline: 'The September king tide flooded West Avenue garages. Get on the free-parking list before the next one.',
			dek: 'If your street sits 2 feet or less above sea level, the city will let you park free in a city garage during a flood alert. You have to sign up first.',
			paragraphs: [
				'Late on Saturday, September 26, tide water rushed into the garage at the Sunshine Bay condominium on West Avenue. Residents told NBC 6 the water came in fast, and some went days without power. Commissioner Alex Fernandez said stormwater pumps alone cannot stop flooding that is driven by the tide. The city says it is spending more than $100 million in the West Avenue area to raise roads and seawalls.',
				'The city runs a King Tide Flood Relief Parking Program for exactly this. If your property sits next to a street that is 2 feet or less above sea level, you can park free in one of three city garages while a flood notice is active. Spaces are first come, first served, and parking is free only while the alert is on.',
				'You have to register before the water comes. Sign up at apps.miamibeachfl.gov/ParkingFloodRelief. After you register, the city emails you when flooding is possible in your area and when the program turns on. The city’s elevation map shows whether your street qualifies. Questions go to the Parking Department at 305-673-7505.',
				'Salt water is hard on cars, garages and anything plugged in near the floor. If your building’s garage takes on water, move cars early, keep chargers and extension cords off the ground, and tell your building manager in writing about any water damage you see.',
			],
		},
		briefs: [
			{
				slug: 'amendment-3',
				kicker: 'Taxes',
				headline: 'Amendment 3 is on your November 3 ballot',
				body: 'Amendment 3 would raise the homestead exemption on non-school property taxes to $150,000 in 2027 and $250,000 in 2028, with inflation adjustments after that. It needs 60% of the vote to pass. It could also lower what cities and counties collect in property tax.',
			},
			{
				slug: 'michigan-avenue-lease',
				kicker: 'City ballot question',
				headline: 'Voters decide on the 1691 Michigan Avenue garage lease',
				body: 'Miami Beach’s special election asks whether the city should amend its lease with RK Rivani LLC for the city-owned garage site at 1691 Michigan Avenue. The amendment would add two 20-year options and allow about 47,000 square feet of new office space above the garage, up to 100 feet tall. The full ballot language and the lease are posted on the City Clerk’s election page.',
			},
			{
				slug: 'early-voting',
				kicker: 'Election',
				headline: 'Early voting is open now, through November 1',
				body: 'Miami-Dade early voting is open 7 a.m. to 7 p.m. every day, Monday, October 19 through Sunday, November 1. In Miami Beach you can vote at City Hall, 1700 Convention Center Drive (first-floor conference room), or the North Shore Branch Library, 7501 Collins Avenue, or at any early voting site in the county. The deadline to request a mail ballot is Thursday, October 22, at 5 p.m. Election Day is Tuesday, November 3.',
			},
			{
				slug: 'mb-alerts',
				kicker: 'Safety',
				headline: 'Get city alerts by text',
				body: 'Text MBALERT to 888777 to get Miami Beach traffic updates and public safety notices on your phone. It is the city’s own alert system, MB Alerts.',
			},
		],
		storm: {
			slug: 'season-not-over',
			kicker: 'Storms & safety',
			headline: 'Hurricane season runs through November 30. Four things to do now.',
			dek: 'All of Miami Beach is an evacuation zone. Know your plan before the county calls it.',
			paragraphs: [
				'Atlantic hurricane season runs through November 30. The city says all of Miami Beach is an evacuation zone, and that the city may face a mandatory evacuation based on storm surge.',
				'If an evacuation is ordered and you have no ride, Miami-Dade Transit runs free buses to mainland shelters from 21 pick-up points in Miami Beach. Call 311 for the list once an evacuation is ordered.',
			],
			list: [
				{
					title: 'Clear the balcony',
					body: 'Bring in chairs, tables and plants before any storm. In high winds they become flying objects.',
				},
				{
					title: 'Check slider tracks and seals',
					body: 'Clean the track of your balcony door so it closes and seals all the way.',
				},
				{
					title: 'Report rust stains and cracks',
					body: 'Rust stains, cracked concrete or loose railings on a balcony are worth reporting to your building manager in writing.',
				},
				{
					title: 'Register pets and special needs early',
					body: 'Families with pets must register for a Miami-Dade animal-friendly shelter before an evacuation warning. Anyone who depends on power or medical help should use the county’s special needs registry early.',
				},
			],
		},
		history: {
			slug: 'how-miami-beach-began',
			kicker: 'Miami Beach then',
			headline: 'A coconut farm, a wooden bridge, and a few dozen voters',
			dek: 'Miami Beach turned 111 this year. It started as a farm on a barrier island.',
			paragraphs: [
				'Before it was a city, Miami Beach was a strip of mangrove and sand. John S. Collins, a businessman from New Jersey, first tried to grow coconuts here, then turned to real estate. Carl Fisher, an automobile tycoon, put up the money to finish the Collins Bridge in 1913, the first link between the island and the mainland. The Lummus brothers were early developers too.',
				'On March 26, 1915, residents voted to make Miami Beach a city. The city’s own history notes that only a few dozen people lived here then.',
			],
		},
		askTheBuilder: {
			slug: 'roof-age',
			kicker: 'Ask the builder',
			headline: '"How do I find out how old my roof is?"',
			dek: 'A reroof needs a permit, so the permit record is your best answer.',
			paragraphs: [
				'Miami Beach keeps current permits in its Citizen Self Service portal (energovcss.miamibeachfl.gov). Older permits are in the city’s Archival Permit Search, linked from the Building Department’s online permitting page at miamibeachfl.gov.',
				'If you cannot find what you need, the City Clerk takes public records requests online.',
				'Condo owners: your association should have the building’s permit and inspection records. Ask the board or the manager.',
				'Have a question about your home? Text it to (772) 473-7115 and we may answer it in a future issue.',
			],
		},
		events: [
			{ when: 'Oct 19 – Nov 1, 7 a.m.–7 p.m.', what: 'Early voting', where: 'City Hall, 1700 Convention Center Dr., and North Shore Library, 7501 Collins Ave.' },
			{ when: 'Wed, Oct 21, 5 p.m.', what: 'City Commission presentations and awards', where: 'City Hall, 3rd floor' },
			{ when: 'Thu, Oct 22, 5 p.m.', what: 'Deadline to request a mail ballot', where: 'Miami-Dade Elections' },
			{ when: 'Tue, Nov 3', what: 'Election Day', where: 'Your assigned polling place' },
			{ when: 'Wed, Nov 4, 5 p.m.', what: 'City Commission presentations and awards', where: 'City Hall, 3rd floor' },
			{ when: 'Wed, Nov 18, 8:30 a.m.', what: 'City Commission meeting', where: 'City Hall, 3rd floor' },
			{ when: 'Mon, Nov 30', what: 'Hurricane season ends', where: 'Atlantic basin' },
		],
		sources: [
			{ label: 'NBC 6 — Miami Beach condo residents dealing with flooding from king tides (Sept. 28, 2026)', url: 'https://www.nbcmiami.com/weather/stories-weather/miami-beach-condo-flooding-king-tides/3865577/' },
			{ label: 'City of Miami Beach — King Tide Flood Relief Parking Program', url: 'https://www.miamibeachfl.gov/city-hall/parking/residents-only/parking-flood-relief-program/' },
			{ label: 'NBC 6 — How much could Amendment 3 save homeowners (Oct. 5, 2026)', url: 'https://www.nbcmiami.com/elections/how-much-could-amendment-3-save-homeowners/3868634/' },
			{ label: 'City of Miami Beach — Related resolutions, November 3, 2026 special election', url: 'https://www.miamibeachfl.gov/city-hall/city-clerk/election-information/related-resolutions-november-3-2026/' },
			{ label: 'City of Miami Beach — November 3, 2026 special election', url: 'https://www.miamibeachfl.gov/city-hall/city-clerk/election-information/november-3-2026-special-election/' },
			{ label: 'Miami-Dade Elections — Early voting schedule, Nov. 3, 2026 (PDF)', url: 'https://documents.miamidade.gov/library/MiamiDadeCounty/early-voting-schedule-november-3-2026-general-election-and-miami-beach-special-election.pdf' },
			{ label: 'City of Miami Beach — Current advisories (MB Alerts)', url: 'https://www.miamibeachfl.gov/city-hall/fire/emergency-management/current-advisories/' },
			{ label: 'City of Miami Beach — Hurricane evacuation', url: 'https://www.miamibeachfl.gov/city-hall/fire/emergency-management/know-your-hazards/hurricanes/evacuation/' },
			{ label: 'City of Miami Beach — The incorporation of Miami Beach (March 26, 1915)', url: 'https://www.miamibeachfl.gov/this-month-in-miami-beach-history-110-anniversary/' },
			{ label: 'City of Miami Beach — Online permitting resource center', url: 'https://www.miamibeachfl.gov/city-hall/building/onlinepermits/' },
			{ label: 'City of Miami Beach — Public records request', url: 'https://www.miamibeachfl.gov/city-hall/city-clerk/public-records-request/' },
			{ label: 'City of Miami Beach — City Commission meeting dates', url: 'https://www.miamibeachfl.gov/city-hall/city-clerk/city-commission-meeting-dates/' },
		],
	},
]

export const currentMiamiBalconyIssue = miamiBalconyIssues[0]

/** Where the printed QR code points. utm tags let the attribution page count scans. */
export const MIAMI_BALCONY_QR_URL =
	'https://covenantbuilders.org/balcony?utm_source=print&utm_medium=paper&utm_campaign=balcony-issue1'
