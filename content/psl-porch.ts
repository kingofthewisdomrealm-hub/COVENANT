/**
 * THE PSL PORCH — a monthly neighborhood paper for Port St. Lucie, Fort Pierce
 * and the rest of St. Lucie County, published by Covenant Builders. Its own
 * paper: it never shares stories with The Vero Porch or The Sebastian Porch.
 * Same house rules (read the header of content/porch.ts before editing):
 *
 * 1. Newspaper first; Covenant gets one box. Sponsor name + address printed.
 * 2. Every fact has a source in `sources`. Re-check event dates the week it prints.
 * 3. Roof copy follows F.S. §489.147 — no claim talk, no gifts or rebates.
 * 4. Homeowner news only. Elections and ballot items: facts and dates, never a
 *    recommendation.
 * 5. St. Lucie County only: Port St. Lucie, Fort Pierce, unincorporated
 *    St. Lucie County (incl. Hutchinson Island in St. Lucie County). Not Vero,
 *    not Sebastian, not Stuart / Martin County.
 */

import type { PorchIssue } from '@/content/porch'

export const PSL_PORCH_NAME = 'The PSL Porch'
export const PSL_PORCH_TAGLINE = 'Neighborhood news for Port St. Lucie & Fort Pierce'
export const PSL_PORCH_SPONSOR =
	'Published monthly by Covenant Builders · 876 47th Avenue, Vero Beach, FL 32966 · Florida Certified Building Contractor CBC1253676'

export const pslPorchIssues: PorchIssue[] = [
	{
		slug: '2026-10',
		volume: 1,
		number: 1,
		monthLabel: 'October 2026',
		checkedOn: '2026-10-10',
		price: '$1 · Free to St. Lucie County residents',
		lead: {
			slug: 'psl-budget-tax-rate-trash-fee',
			kicker: 'Bills & taxes',
			headline: 'Port St. Lucie cut its tax rate again. The trash fee went up.',
			dek: 'The city’s new budget year started October 1. Here is what changes on the tax bill that lands in November.',
			paragraphs: [
				'Port St. Lucie’s new budget year started October 1. On September 28, the City Council voted to lower the city’s property tax rate for the 11th year in a row, from 4.9750 mills to 4.8750 mills. A mill is $1 of tax for every $1,000 of your home’s taxable value. The new city budget is $971.6 million.',
				'What does a cut of one-tenth of a mill mean? At the same taxable value, you pay $10 less in city tax for every $100,000 of taxable value. Your bill can still go up if your home’s taxable value went up. The city is only part of the bill: it says it gets about 22% of a resident’s total property tax. The other 78% goes to the county, the School Board and other agencies. The School Board set a total school rate of 6.2450 mills on September 8.',
				'The trash fee went up. On August 24 the council set the yearly solid waste assessment at $482.16 per home, $14.83 more than last year, or about $1.24 a month. The city says its contract with its hauler, FCC Environmental Services, requires the increase to cover labor, equipment, repairs and fuel. The fee is on your property tax bill, not your water bill.',
				'Many owners will also see a credit. The city won $24 million from its old hauler, Waste Pro, and is giving it back as credits on 2026 tax bills. About 95,000 properties should get one. Owners who have had the same home since 2022 get about $364; about 38,000 other eligible properties could get about $64. Check at cityofpsl.com/credit.',
				'What to do this month: watch for your tax bill. Florida law gives 4% off if you pay in November, 3% in December, 2% in January and 1% in February. Questions about the bill go to the St. Lucie County Tax Collector at (772) 462-1650. Questions about the city trash or stormwater fees go to financeassessment@cityofpsl.com or (772) 871-1775.',
			],
		},
		briefs: [
			{
				slug: 'early-voting',
				kicker: 'Election',
				headline: 'Early voting runs October 19 to 31',
				body: 'Early voting is open 10 a.m. to 6 p.m. every day, October 19 through 31, at eight sites in Port St. Lucie and Fort Pierce. The deadline to request a mail ballot is Thursday, October 22, at 5 p.m. Election Day is Tuesday, November 3. In Port St. Lucie, Mayor Shannon Martin faces Steven Giordano, and in City Council District 1, Rick Meltzer faces Indony Jean Baptiste. Sites and sample ballots: stlucievotes.gov.',
			},
			{
				slug: 'trash-straw-poll',
				kicker: 'On the ballot',
				headline: 'PSL voters get a say on twice-a-week trash pickup',
				body: 'Port St. Lucie ballots include a straw poll asking whether residents want trash picked up twice a week instead of once. The result is nonbinding; the City Council still decides. City staff say twice-weekly pickup would raise the trash fee by at least $131 a year starting in 2028. Bulk, recycling and yard waste pickup would not change.',
			},
			{
				slug: 'half-cent-sales-tax',
				kicker: 'On the ballot',
				headline: 'County asks voters to renew the half-cent sales tax',
				body: 'St. Lucie County’s half-cent infrastructure sales tax, approved in 2018, runs out in 2028. A November 3 question asks voters to renew it for 10 more years, January 1, 2029 through December 31, 2038. The money can only go to things like roads, drainage, flood control, water quality and sidewalks, not day-to-day costs. It is split between the county and its cities.',
			},
			{
				slug: 'amendment-3',
				kicker: 'Taxes',
				headline: 'Amendment 3: what it would do, and two city info sessions',
				body: 'Amendment 3 would raise the homestead exemption on non-school taxes and cut the yearly assessment cap on non-homestead property from 10% to 5%. It needs 60% to pass. Port St. Lucie estimates it would collect $26.3 million less in the first year. In Fort Pierce, commissioners warned it could cut city tax money by millions. PSL holds info sessions October 13 and October 27.',
			},
		],
		storm: {
			slug: 'season-not-over',
			kicker: 'Storms & safety',
			headline: 'Hurricane season runs through November 30. Four things to do now.',
			dek: 'Late storms still reach the Treasure Coast. Here is a St. Lucie County checklist.',
			paragraphs: [
				'Atlantic hurricane season runs through November 30, and late-season storms can still bring wind, rain and flooding. Now is a good time to make sure your family knows your evacuation zone and how you will hear about an order.',
				'St. Lucie County uses two storm surge zones: Zone A for surge of 1 to 10 feet and Zone B for 10 to 16 feet. If you live in a mobile home, manufactured home or RV, plan to leave for any hurricane, wherever you are in the county.',
			],
			list: [
				{
					title: 'Look up your zone',
					body: 'Type your address into St. Lucie County’s Know Your Zone map (linked from stlucieco.gov) to see your evacuation zone and whether it is under an order.',
				},
				{
					title: 'Sign up for Alert St. Lucie',
					body: 'The county’s free alert system sends severe weather, evacuation and road-closure warnings by text, email or call. Sign up at stlucieco.gov/alert.',
				},
				{
					title: 'Save these numbers',
					body: 'St. Lucie County Emergency Management: (772) 462-8100. Shelter information line: (772) 460-HELP (4357). City of Port St. Lucie: (772) 871-1775.',
				},
				{
					title: 'Know your shelter',
					body: 'Not every shelter opens for every storm, so check before you go. The pet-friendly shelter is Westwood High, 1801 Panther Lane. If someone at home has medical needs, register at stlucieco.gov/specialneeds.',
				},
			],
		},
		history: {
			slug: 'how-psl-began',
			kicker: 'PSL then',
			headline: 'How a land company built Port St. Lucie out of the woods',
			dek: 'In 1958 there was almost nothing here. Today more than 200,000 people call it home.',
			paragraphs: [
				'In the 1950s, the land that is now Port St. Lucie was mostly empty: a fishing camp and a few farms and businesses near U.S. 1. In 1958, General Development Corporation bought the River Park development and about 40,000 acres along the North Fork of the St. Lucie River, and in 1959 it opened its first bridge over the river.',
				'Port St. Lucie became a city on April 27, 1961, with about 250 homes built. The company, which had already built Port Charlotte on the Gulf Coast, put “Port” in the names of its big Florida towns, and sold lots to Northerners planning to retire. The oldest part of the city is Sandpiper Bay.',
				'Then it grew fast. The Census counted 330 people in 1970 and 55,866 in 1990. By 1988, Port St. Lucie had passed Fort Pierce as the county’s biggest city. The developer went bankrupt in 1991, but the city kept growing; the 2020 Census counted 204,851 residents.',
			],
		},
		askTheBuilder: {
			slug: 'roof-age',
			kicker: 'Ask the builder',
			headline: '"How do I find out how old my roof is?"',
			dek: 'A reroof needs a permit, so the permit record is your best answer. Where you look depends on where you live.',
			paragraphs: [
				'Port St. Lucie: the city Building Department has an online “Search Permits on a Property” tool on its page at cityofpsl.com. Questions: (772) 871-5132.',
				'Fort Pierce: permits applied for since July 15, 2024 are in the city’s online Citizen Self Service system at cityoffortpierce.com/epl. For older permits, call the Building Department at (772) 467-3718.',
				'Outside city limits: St. Lucie County’s Building & Code Regulation Division keeps those records. Call (772) 462-1553 or visit 2300 Virginia Ave. in Fort Pierce.',
				'Have a question about your house? Text it to (772) 473-7115 and we may answer it in a future issue.',
			],
		},
		events: [
			{ when: 'Saturdays, 8 a.m.–noon', what: 'Downtown Fort Pierce Farmers Market', where: 'Marina Square, 101 Melody Lane, Fort Pierce' },
			{ when: 'Tue, Oct 13, 6 p.m.', what: 'City “Community Conversation”: budget, Amendment 3, sales tax, trash poll', where: 'MIDFLORIDA Event Center, 9221 SE Event Center Pl., PSL' },
			{ when: 'Oct 19 – 31, 10 a.m.–6 p.m.', what: 'Early voting', where: '8 sites; list at stlucievotes.gov' },
			{ when: 'Tue, Oct 27, noon', what: 'Last city “Community Conversation” on ballot issues', where: 'PSL City Hall Council Chambers, 121 SW Port St. Lucie Blvd.' },
			{ when: 'Oct 30 – Nov 1', what: 'Fall Fun Fest (free admission)', where: 'MIDFLORIDA Event Center, PSL' },
			{ when: 'Tue, Nov 3', what: 'Election Day', where: 'Your assigned polling place' },
			{ when: 'Wed, Nov 11, 11 a.m.', what: 'Veterans Day Ceremony (bring a lawn chair)', where: 'Veterans Memorial Park, 2100 SE Veterans Memorial Pkwy, PSL' },
		],
		sources: [
			{ label: 'City of Port St. Lucie — Council lowers millage rate for 11th straight year', url: 'https://www.cityofpsl.com/News-Stories/2026/Port-St.-Lucie-City-Council-lowers-millage-rate-for-11th-straight-year' },
			{ label: 'WFLX — Port St. Lucie lowers property tax rate for 11th straight year (Sept. 29, 2026)', url: 'https://www.wflx.com/2026/09/29/port-st-lucie-lowers-property-tax-rate-11th-straight-year/' },
			{ label: 'WQCS — Port St. Lucie approves increase in annual trash assessment (Aug. 31, 2026)', url: 'https://www.wqcs.org/wqcs-news/2026-08-31/port-st-lucie-approves-increase-in-annual-trash-assessment' },
			{ label: 'CBS12 — PSL to consider $14.83 annual trash fee increase', url: 'https://cbs12.com/news/local/port-st-lucie-to-consider-1483-annual-trash-fee-increase-amid-lingering-pickup-concerns-fcc-environmental-service-october-1-scott-samples-inflation-costs-labor-equipment-maintenance' },
			{ label: 'CBS12 — Twice-a-week trash pickup straw poll', url: 'https://cbs12.com/news/local/twice-a-week-trash-pickup-in-port-st-lucie-voters-could-get-say-cost-131-dollars-year-straw-poll-november-ballot-city-decision-monday-vote-additional-cost-increases' },
			{ label: 'City of Port St. Lucie — Special Assessment & Property Tax', url: 'https://www.cityofpsl.com/Government/Your-City-Government/Departments/Finance-Department/Special-Assessment-Property-Tax' },
			{ label: 'CitizenPortal — St. Lucie School Board adopts budget, 6.2450 total millage (Sept. 8, 2026)', url: 'https://citizenportal.ai/articles/9947628/florida/school-districts/st-lucie/st-lucie-board-adopts-1102-billion-budget-approves-62450-total-millage' },
			{ label: 'Florida Statutes §197.162 — Discounts for early payment', url: 'https://www.flsenate.gov/Laws/Statutes/2025/197.162' },
			{ label: 'St. Lucie Supervisor of Elections — Early Voting & Election Dates', url: 'https://www.stlucievotes.gov/public_records/public_notices/early_voting_election_dates.php' },
			{ label: 'WQCS — St. Lucie County primary results (Aug. 19, 2026)', url: 'https://www.wqcs.org/wqcs-news/2026-08-19/st-lucie-county-primary-results-port-st-lucie-mayor-school-board-races-head-to-november' },
			{ label: 'WQCS — County moves ahead with half-cent sales tax referendum (Aug. 5, 2026)', url: 'https://www.wqcs.org/wqcs-news/2026-08-05/st-lucie-county-commission-moves-ahead-with-2026-half-cent-sales-tax-referendum' },
			{ label: 'City of Port St. Lucie — Amendment 3: What Florida Voters Should Know', url: 'https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Manager/Amendment-3-What-Florida-Voters-Should-Know' },
			{ label: 'City of Port St. Lucie — Community sessions on budget, Amendment 3 and ballot initiatives', url: 'https://www.cityofpsl.com/News-Stories/2026/Community-sessions-on-budget-Amendment-3-and-local-ballot-initiatives' },
			{ label: 'CitizenPortal — Fort Pierce backs FY 2026–27 budget as state tax changes loom', url: 'https://citizenportal.ai/articles/8487309/florida/st-lucie-county/fort-pierce/fort-pierce-commission-backs-fy-202627-budget-using-rolledover-capital-funds-as-state-tax-changes-loom' },
			{ label: 'City of Port St. Lucie — Hurricanes and Storms', url: 'https://www.cityofpsl.com/Residents/Resources/Hurricane-Preparedness' },
			{ label: 'St. Lucie County — Emergency Shelters & Evacuation Zones (PDF)', url: 'https://cityofpsl.com/files/assets/public/v/1/departments/emergency-management/documents/emergency-shelters-evacua.pdf' },
			{ label: 'Port St. Lucie Historical Society — PSL Q&A', url: 'https://pslhistory.org/psl-q%26a' },
			{ label: 'Wikipedia — Port St. Lucie, Florida (history and census)', url: 'https://en.wikipedia.org/wiki/Port_St._Lucie,_Florida' },
			{ label: 'City of Port St. Lucie — Building Department', url: 'https://cityofpsl.com/Government/Your-City-Government/Departments/Building' },
			{ label: 'City of Fort Pierce — Building Department', url: 'https://fl-fortpierce.civicplus.com/131/Building-Department' },
			{ label: 'St. Lucie County — Building Permits', url: 'https://stlucieco.gov/doing-business/building-permits' },
			{ label: 'City of Port St. Lucie — Free, family-friendly fall events', url: 'https://www.cityofpsl.com/News-Stories/2026/Free-family-friendly-fall-events-return-to-Port-St.-Lucie' },
			{ label: 'Visit St. Lucie — Downtown Fort Pierce Farmers Market', url: 'https://visitstlucie.com/?p=10001736' },
		],
	},
]

export const currentPslPorchIssue = pslPorchIssues[0]

/** Where the printed QR code points. utm tags let the attribution page count scans. */
export const PSL_PORCH_QR_URL =
	'https://covenantbuilders.org/psl-porch?utm_source=psl-porch&utm_medium=print&utm_campaign=psl-porch-2026-10'
