/**
 * THE ORLANDO BALCONY — a monthly neighborhood paper for homeowners in the
 * City of Orlando, published by Covenant Builders. Its own paper: it never
 * shares stories with The Vero Porch, The Sebastian Porch or The PSL Porch.
 * Same house rules (read the header of content/porch.ts before editing):
 *
 * 1. Newspaper first; Covenant gets one box. Sponsor name + address printed.
 * 2. Every fact has a source in `sources`. Re-check event dates the week it prints.
 * 3. Roof copy follows F.S. §489.147 — no claim talk, no gifts or rebates.
 * 4. Homeowner news only. Elections and ballot items: facts and dates, never a
 *    recommendation.
 * 5. Orlando only: the City of Orlando, plus Orange County news when it lands
 *    on Orlando homes (county tax rate, county elections, county storm alerts).
 *    Not Winter Park, Maitland, Kissimmee or other cities — and never Treasure
 *    Coast news.
 */

import type { PorchIssue } from '@/content/porch'

export const ORLANDO_BALCONY_NAME = 'The Orlando Balcony'
export const ORLANDO_BALCONY_TAGLINE = 'Neighborhood news for Orlando homeowners'
export const ORLANDO_BALCONY_SPONSOR =
	'Published monthly by Covenant Builders · 876 47th Avenue, Vero Beach, FL 32966 · Florida Certified Building Contractor CBC1253676'

export const orlandoBalconyIssues: PorchIssue[] = [
	{
		slug: '2026-10',
		volume: 1,
		number: 1,
		monthLabel: 'October 2026',
		checkedOn: '2026-10-10',
		price: '$1 · Free to Orlando residents',
		lead: {
			slug: 'orlando-trash-sewer-stormwater-tax-rate',
			kicker: 'Bills & taxes',
			headline: 'Orlando kept its tax rate. Your trash and sewer bills went up.',
			dek: 'The city’s new budget year started October 1. Here is what changed on your OUC bill, and what to watch for on the tax bill in November.',
			paragraphs: [
				'The City of Orlando started a new budget year on October 1. The city’s property tax rate stays at 6.6500 mills, the same rate it has used for more than a decade. A mill is $1 of tax for every $1,000 of your home’s taxable value. The new city budget is about $1.88 billion.',
				'Same rate does not always mean same bill. If your home’s taxable value went up, your city tax goes up too. The city’s own example: a home assessed at $416,300, minus the $50,000 homestead exemption, has $366,300 of taxable value. At 6.65 mills that is $2,436 a year in city tax, about $203 a month. The city says it gets about 35 cents of each property-tax dollar. The rest goes to Orange County, the schools, the water management district and the library system. Orange County also kept its countywide rate at 4.4347 mills.',
				'Your trash bill went up. Trash pickup for a single-family home is now $26.73 a month, $3.28 more than before. It is billed on your OUC bill. The City Council approved a four-year plan in June: $29.94 next year, then $31.44, then $33.01 in 2030.',
				'Your sewer bill went up too. Starting October 1, the base charge inside city limits went from $25.60 to $28.03 a month, and the usage charge went from $6.18 to $6.77 per 1,000 gallons, up to 14,000 gallons. The city says a home using 7,000 gallons now pays $75.42 a month for sewer. By our math, that is about $6.56 more than last year, so trash and sewer together add almost $10 a month for that home.',
				'One more line to watch is the stormwater fee. It is on your Orange County property tax bill and is based on how many square feet of your lot are roofed or paved. It is in the middle of a four-year increase that started in October 2024. The 2027 rate is $0.12138 per square foot, up from $0.10115.',
				'What to do this month: watch for your tax bill. Florida law gives 4% off if you pay in November, 3% in December, 2% in January and 1% in February. Questions about the tax bill go to the Orange County Tax Collector at (407) 434-0312.',
			],
		},
		briefs: [
			{
				slug: 'ouc-demand-charge',
				kicker: 'Utilities',
				headline: 'OUC adds a new “DemandLevel” charge in November',
				body: 'Starting with most November bills, OUC will add a monthly charge based on your home’s peak demand in October: the highest 15 minutes of electricity use in the billing cycle. It shows as Tier 1, 2 or 3 and resets every month. To offset it, OUC is cutting its per-kilowatt-hour energy rate by 12.5%. OUC says for most customers the lower rate should cover most of the new charge. Running the dryer, oven and A/C at different times keeps your peak lower.',
			},
			{
				slug: 'early-voting',
				kicker: 'Election',
				headline: 'Early voting runs October 19 to November 1',
				body: 'Orange County early voting is open 8 a.m. to 8 p.m. every day, Monday, October 19 through Sunday, November 1, at 27 sites. The deadline to request a mail ballot is Thursday, October 22, at 5 p.m., and mail ballots must arrive by 7 p.m. on Election Day, Tuesday, November 3. Races include Orange County Mayor and County Commission Districts 2, 4, 6, 7 and 8. Sites and sample ballots: voteorangefl.gov or (407) 836-2070.',
			},
			{
				slug: 'amendment-3',
				kicker: 'Taxes',
				headline: 'Amendment 3: what it would do, by the numbers',
				body: 'Amendment 3 would raise the homestead exemption on non-school taxes to $150,000 in 2027 and $250,000 in 2028, and cut the yearly assessment cap on non-homestead property from 10% to 5%. It needs 60% to pass. Orlando staff estimate the city could collect up to $35 million less in 2028 and up to $50 million less by 2030. Orange County estimates $165 million less in 2027. The city’s new budget sets aside savings in case it passes.',
			},
			{
				slug: 'school-levy',
				kicker: 'On the ballot',
				headline: 'Orange County voters asked to continue the school 1-mill levy',
				body: 'A November 3 question asks Orange County voters whether to keep the school district’s current 1-mill operating levy from July 1, 2027, through June 30, 2031. On a home with $300,000 of taxable value, one mill is $300 a year.',
			},
		],
		storm: {
			slug: 'season-not-over',
			kicker: 'Storms & safety',
			headline: 'Hurricane season runs through November 30. Four things to do now.',
			dek: 'Hurricane Isaias came ashore in the Panhandle on October 9. Late storms still reach Central Florida.',
			paragraphs: [
				'Hurricane Isaias, the season’s first hurricane, came ashore near Destin on the night of October 9 and weakened as it moved inland. Atlantic hurricane season runs through November 30, and late storms can still bring wind and flooding to Orlando.',
				'Orlando is inland, so wind, heavy rain and street flooding are the big risks here. Clean gutters and clear the storm drain at your curb before a storm, and bring in anything the wind can throw.',
			],
			list: [
				{
					title: 'Sign up for OCAlert',
					body: 'Orange County’s free alert system sends emergency, weather and shelter warnings by text, email or phone. Sign-up is linked from ocfl.net/storm.',
				},
				{
					title: 'Save these numbers',
					body: 'Orange County 311 or (407) 836-3111 (Spanish operators available). Orange County Office of Emergency Management: (407) 836-9140.',
				},
				{
					title: 'Report flooding and clogged drains',
					body: 'Call 311 to report standing water or a clogged storm drain. Inside city limits you can also use the “Report Flooding” link on orlando.gov.',
				},
				{
					title: 'Register anyone with medical needs',
					body: 'If someone at home depends on power or medical help, sign them up for the People with Special Needs registry at ocfl.net/psn or by calling 311.',
				},
			],
		},
		history: {
			slug: 'how-orlando-got-its-name',
			kicker: 'Orlando then',
			headline: 'A fort, a settlement called Jernigan, and four stories about a name',
			dek: 'Orlando turned 151 this summer. Nobody agrees on where its name came from.',
			paragraphs: [
				'In 1838, during the Seminole Wars, the U.S. Army built Fort Gatlin just south of today’s city limits. By 1840 a settlement had grown up nearby. It was called Jernigan, after its first permanent settlers, and got a post office in 1850.',
				'In 1856 the settlement changed its name to Orlando. Where the name came from is still argued about. The city lists four stories: a judge named it for a man who once worked for him; the same judge named it for the character in Shakespeare’s “As You Like It”; a traveler named Mr. Orlando died and was buried here on the way to Tampa; or it honors Orlando Reeves, a sentry killed during the Seminole Wars and buried on the south side of Lake Eola.',
				'The Town of Orlando was incorporated on July 31, 1875, with 85 residents. Lake Eola became a city park in 1888, its first swans arrived in 1922, and its fountain went up in 1957.',
			],
		},
		askTheBuilder: {
			slug: 'roof-age',
			kicker: 'Ask the builder',
			headline: '"How do I find out how old my roof is?"',
			dek: 'A reroof needs a permit, so the permit record is your best answer. Where you look depends on whether you live inside city limits.',
			paragraphs: [
				'Inside the City of Orlando: use “Check Permit Status” on orlando.gov to search the city’s online permit records. Questions go to Permitting Services at (407) 246-2271 or digitalpermits@orlando.gov, or visit the first floor of City Hall, 400 S. Orange Ave.',
				'Unincorporated Orange County (an Orlando mailing address but outside city limits): search Orange County’s Fast Track system by address at fasttrack.ocfl.net. Permits from before June 4, 2012 are in its Historical Permit Search. Questions: (407) 836-5550, or the first floor of 201 S. Rosalind Ave.',
				'Not sure which side of the line you are on? Your property record at ocpafl.org shows your city.',
				'Have a question about your house? Text it to (772) 473-7115 and we may answer it in a future issue.',
			],
		},
		events: [
			{ when: 'Sundays, 10 a.m.–3 p.m.', what: 'Orlando Farmers Market', where: 'Lake Eola Park, Eola Dr. & Central Blvd.' },
			{ when: 'Mon, Oct 12, 2 p.m.', what: 'City Council meeting (also Oct 26 & Nov 9)', where: 'City Hall, 400 S. Orange Ave.' },
			{ when: 'Oct 19 – Nov 1, 8 a.m.–8 p.m.', what: 'Early voting', where: '27 sites; list at voteorangefl.gov' },
			{ when: 'Sat, Oct 24, 4–9 p.m.', what: 'Eolaween (free; movie at 7:30 p.m.)', where: 'Lake Eola Park' },
			{ when: 'Tue, Nov 3', what: 'Election Day', where: 'Your assigned polling place' },
			{ when: 'Sat, Nov 7, 11 a.m.', what: '27th Veterans Day Parade (free)', where: 'Lake Nona Town Center, 6955 Lake Nona Blvd.' },
			{ when: 'Nov 7 – 8, 10 a.m.–5 p.m.', what: '55th Fall Fiesta in the Park (free)', where: 'Lake Eola Park' },
		],
		sources: [
			{ label: 'City of Orlando — Property Taxes', url: 'https://www.orlando.gov/Our-Government/Records-and-Documents/Financial/Budget-Documents/Property-Taxes' },
			{ label: 'Spectrum News 13 — Orlando to hold first public hearing on budget (Sept. 14, 2026)', url: 'https://mynews13.com/fl/orlando/news/2026/09/14/orlando-to-hold-first-public-hearing-on-1-billion-budget' },
			{ label: 'Spectrum News 13 — Orlando weighs Amendment 3’s potential impact (Sept. 15, 2026)', url: 'https://mynews13.com/fl/orlando/news/2026/09/15/orlando-weighs-amendment-s-potential-impact-during-budget-discussions' },
			{ label: 'WFTV — Orlando city leaders advance budget', url: 'https://www.wftv.com/news/local/orlando-city-leaders-advance-2-billion-budget-final-passage-slated-late-sept/7LCOJEQNTREPXEVJDXJL7FYTUU/' },
			{ label: 'Spectrum News 13 — Orange County approves budget (Sept. 25, 2026)', url: 'https://mynews13.com/fl/orlando/news/2026/09/25/orange-county-approves--billion-budget-with-public-safety-funding' },
			{ label: 'City of Orlando — Solid Waste Rate Adjustment', url: 'https://www.orlando.gov/Our-Government/Departments-Offices/Public-Works/Solid-Waste/Solid-Waste-Rate-Adjustment' },
			{ label: 'City of Orlando — Understand Your Sewer Bill', url: 'https://www.orlando.gov/Our-Government/Departments-Offices/Public-Works/Water-Reclamation-Division/Understand-Your-Sewer-Bill' },
			{ label: 'City of Orlando — Stormwater Utility Fee', url: 'https://www.orlando.gov/Our-Government/Departments-Offices/Public-Works/Streets-and-Stormwater-Division/Stormwater-Utility-Fee' },
			{ label: 'Orange County Tax Collector — About Property Tax', url: 'https://www.octaxcol.com/taxes/about-property-tax/' },
			{ label: 'Florida Statutes §197.162 — Discounts for early payment', url: 'https://www.flsenate.gov/Laws/Statutes/2025/197.162' },
			{ label: 'WKMG — Price changes coming for OUC customers (Sept. 14, 2026)', url: 'https://www.clickorlando.com/news/local/2026/09/14/price-changes-coming-for-orlando-utilities-commission-customers-heres-when/' },
			{ label: 'Orange County Supervisor of Elections — Election calendar', url: 'https://voteorangefl.gov/election-calendar/' },
			{ label: 'Orange County Supervisor of Elections — Early voting', url: 'https://voteorangefl.gov/early-voting/' },
			{ label: 'Orange County Supervisor of Elections — 2026 General Election sample ballot (PDF)', url: 'https://voteorangefl.gov/wp-content/uploads/2026/10/26GEN113-CB-EN-26-10-1-15-9-21.pdf' },
			{ label: 'Orange County — Property Tax Amendment 3', url: 'http://ocfl.net/OpenGovernment/PropertyTaxAmendment3.aspx' },
			{ label: 'Spectrum News 13 — Tracking Isaias', url: 'https://mynews13.com/fl/orlando/weather/2026/10/05/tracking-isaias' },
			{ label: 'Orange County — Storm information (OCAlert)', url: 'https://www.ocfl.net/storm' },
			{ label: 'Orange County — Hurricane Safety Guide', url: 'https://ocfl.net/EmergencySafety/HurricaneSafetyGuide.aspx' },
			{ label: 'Orange County — People with Special Needs program', url: 'https://ocfl.net/EmergencySafety/EmergencyMedicalServices/SpecialNeedsProgram.aspx' },
			{ label: 'City of Orlando — History', url: 'https://www.orlando.gov/Our-Government/History' },
			{ label: 'City of Orlando — Lake Eola History', url: 'https://www.orlando.gov/Parks-the-Environment/Directory/Lake-Eola-Park/Lake-Eola-History' },
			{ label: 'WKMG — Orlando turns 150 (July 31, 2025)', url: 'https://www.clickorlando.com/news/local/2025/07/31/orlando-turns-150-celebrate-with-fun-events-freebies-more' },
			{ label: 'City of Orlando — Permitting Services', url: 'https://www.orlando.gov/Our-Government/Departments-Offices/Economic-Development/Permitting-Services' },
			{ label: 'Orange County — Fast Track permit search', url: 'https://fasttrack.ocfl.net/OnlineServices/Permit-Building.aspx' },
			{ label: 'Orange County — Permits', url: 'https://ocfl.net/PermitsLicenses/Permits.aspx' },
			{ label: 'City of Orlando — Orlando Farmers Market', url: 'https://www.orlando.gov/Events/Orlando-Farmers-Market' },
			{ label: 'City of Orlando — City Council Meeting', url: 'https://www.orlando.gov/Events/City-Council-Meeting' },
			{ label: 'City of Orlando — Eolaween 2026', url: 'https://www.orlando.gov/Events/Eolaween-2026' },
			{ label: 'City of Orlando — 2026 Veterans Day Parade', url: 'https://www.orlando.gov/Events/2026-Veterans-Day-Parade' },
			{ label: 'City of Orlando — 2026 Fall Fiesta in the Park', url: 'https://www.orlando.gov/Events/2026-Fall-Fiesta-in-the-Park' },
		],
	},
]

export const currentOrlandoBalconyIssue = orlandoBalconyIssues[0]

/** Where the printed QR code points. utm tags let the attribution page count scans. */
export const ORLANDO_BALCONY_QR_URL =
	'https://covenantbuilders.org/orlando-balcony?utm_source=orlando-balcony&utm_medium=print&utm_campaign=orlando-balcony-2026-10'
