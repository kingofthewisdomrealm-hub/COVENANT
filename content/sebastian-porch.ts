/**
 * THE SEBASTIAN PORCH — a monthly neighborhood paper for Sebastian residents,
 * published by Covenant Builders. Same rules as The Vero Porch: read the header
 * of content/porch.ts before editing. In short:
 *
 * 1. Newspaper first; Covenant gets one box. Indian River County §310 handbill
 *    rules apply county-wide, Sebastian included; sponsor name + address printed.
 * 2. Every fact has a source in `sources`. Re-check event dates the week it prints.
 * 3. Roof copy follows F.S. §489.147 — no claim talk, no gifts or rebates.
 * 4. Homeowner news only. Elections and ballot items: facts and dates, never a
 *    recommendation.
 * 5. Sebastian only. City of Sebastian news first; county news only when it
 *    lands on Sebastian homeowners.
 */

import { currentPorchIssue, type PorchIssue } from '@/content/porch'

export const SEBASTIAN_PORCH_NAME = 'The Sebastian Porch'
export const SEBASTIAN_PORCH_TAGLINE = 'Neighborhood news for Sebastian'
export const SEBASTIAN_PORCH_SPONSOR =
	'Published monthly by Covenant Builders · 876 47th Avenue, Vero Beach, FL 32966 · Florida Certified Building Contractor CBC1253676'

export const sebastianPorchIssues: PorchIssue[] = [
	{
		slug: '2026-10',
		volume: 1,
		number: 1,
		monthLabel: 'October 2026',
		checkedOn: '2026-10-09',
		price: '$1 · Free to Sebastian residents',
		lead: {
			slug: 'septic-deadline',
			kicker: 'Septic and sewer',
			headline: 'On septic in Sebastian? A state deadline is less than four years away.',
			dek: 'By July 1, 2030, most septic tanks near the lagoon must connect to sewer or be upgraded. In Sebastian, your sewer comes from the county, not the city.',
			paragraphs: [
				'If your house in Sebastian sits on a septic tank, a 2023 state law sets the clock. Under the Indian River Lagoon Protection Program, by July 1, 2030, an existing septic system in the program area must connect to central sewer where it is available, or be upgraded to an enhanced system that removes at least 65% of the nitrogen. Since January 1, 2024, every new septic system in the area has had to be that enhanced type.',
				'One thing surprises a lot of Sebastian owners: the City of Sebastian does not run the sewer. Indian River County provides sewer service here, so the letters, the connection rules and the assistance program all come from the county.',
				'County staff gave these ranges at public workshops in September: $5,000 to $8,000 to connect to a gravity sewer main, $11,000 to more than $20,000 when a lift or grinder pump is needed, and $15,000 to $25,000 to retrofit an existing tank to the enhanced type. The county is setting up a Sewer Connection Assistance Program of up to $15,000 per eligible property; as of early October it had not opened for applications.',
				'Along the waterfront, the city and county have been extending sewer lines through Sebastian’s Community Redevelopment Area so every parcel there can connect. A Florida Department of Environmental Protection grant helps residents and businesses in that area with the cost of closing the septic tank and hooking up.',
				'What to do this month: look up your address on the county’s program site, ircs2sprogram.com; open every letter from county utilities; and get more than one price from a licensed plumber. Questions go to the county program team at 772-770-5300.',
			],
		},
		briefs: [
			{
				slug: 'council-election',
				kicker: 'On the ballot',
				headline: 'Two city council seats are up on November 3',
				body: 'Five candidates are running for two at-large Sebastian City Council seats, each a two-year term: Robert Gable, Damien Gilliams, Richard Gillmor, Sherrie Matthews (the incumbent) and Deborah Shellenberger. Mail ballots are already out. After the election the council chooses its own mayor and vice mayor. At a candidate forum, growth, annexation, the city budget, septic-to-sewer and the lagoon took most of the time.',
			},
			{
				slug: 'tax-rate',
				kicker: 'Your tax bill',
				headline: 'City sets its tax rate at the rollback rate',
				body: 'On September 14 the council voted unanimously for a tentative city tax rate of 3.3318 mills for the budget year that began October 1, down from 3.4455 mills last year. That is the rollback rate: the rate that raises about the same property tax money as last year, not counting new construction. Staff said balancing the budget at that rate uses about $262,000 of city reserves. The city rate is one line on your bill; the county, school board and other districts set their own.',
			},
			{
				slug: 'amendment-3',
				kicker: 'Taxes',
				headline: 'Amendment 3: what it could mean for the city budget',
				body: 'Amendment 3 would raise the homestead exemption on non-school property taxes and cut the yearly assessment cap on non-homestead property from 10% to 5%. It needs 60% to pass. A city budget workshop estimated a first-year hit to Sebastian’s budget of about $2.8 million. Indian River County holds a public forum on local impacts on October 14, 6–7:30 p.m., at the County Fairgrounds.',
			},
			{
				slug: 'rabies-alert',
				kicker: 'Pets',
				headline: '60-day rabies alert next door in Fellsmere',
				body: 'The health department issued a 60-day rabies alert after a bat captured September 24 near Sonrise Place in Fellsmere tested positive. Keep pets’ rabies shots current, keep them leashed, do not leave pet food outside, and keep bats and other wildlife out of the house. Report bites or scratches to the health department at 772-794-7472.',
			},
		],
		storm: currentPorchIssue.storm,
		history: {
			slug: 'pelican-island',
			kicker: 'Sebastian then',
			headline: 'The first national wildlife refuge is in our backyard',
			dek: 'In 1903 a three-acre island in the lagoon started the whole system.',
			paragraphs: [
				'On March 14, 1903, President Theodore Roosevelt set aside Pelican Island, in the Indian River Lagoon off Sebastian, as a federal bird reservation "for the protection of nesting birds." He acted with encouragement from ornithologist Frank Chapman and the Florida Audubon Society.',
				'It was the first federal bird reservation, and it became the first national wildlife refuge, the start of today’s National Wildlife Refuge System. By the end of his presidency Roosevelt had created 55 bird reservations and national game preserves, nine more of them in Florida.',
				'Audubon hired Paul Kroegel as the refuge’s first warden. The island itself has shrunk from about 5.5 acres in 1903 to about 3 acres, worn away by erosion, but the refuge around it now covers more than 5,400 acres of wetland and upland.',
			],
		},
		askTheBuilder: {
			slug: 'roof-age',
			kicker: 'Ask the builder',
			headline: '"Why does my insurance company keep asking how old my roof is?"',
			dek: 'Because roof age is one of the first things an insurer looks at when it writes or renews a Florida policy.',
			paragraphs: [
				'If you do not know your roof’s age, you are not alone. Many homes have changed hands since the last reroof, and the paperwork went with the previous owner.',
				'The building permit record usually has the answer, because a reroof needs a permit. Inside city limits, that record is with the City of Sebastian Building Department. Outside city limits, it is with Indian River County.',
				'Have a question about your house? Text it to (772) 473-7115 and we may answer it in a future issue.',
			],
		},
		events: [
			{ when: 'Wed, Oct 14, 6–7:30 p.m.', what: 'Amendment 3 public forum (county)', where: 'Indian River County Fairgrounds' },
			{ when: 'Wed, Oct 14, 8–9:30 p.m.', what: 'Haunted Tiki Tour on the lagoon ($50, book ahead)', where: 'Mulligan’s Marina, 806 Indian River Dr.' },
			{ when: 'Thu, Oct 15, 5–7:30 p.m.', what: 'Sebastian Police Community Night Out', where: 'Riverview Park' },
			{ when: 'Oct 16 – 18', what: 'Vero Beach Oktoberfest', where: 'Indian River County Fairgrounds, 7955 58th Ave' },
			{ when: 'Tue, Nov 3', what: 'Election Day: city council and Amendment 3', where: 'Your assigned polling place' },
		],
		sources: [
			{ label: 'Sebastian Daily — Five Sebastian council candidates face voters on growth, taxes and the lagoon (Oct. 6, 2026)', url: 'https://www.sebastiandaily.com/business/five-sebastian-council-candidates-face-voters-on-growth-taxes-and-the-lagoon-95985/' },
			{ label: 'Sebastian Daily — Police to host Community Night Out on Oct. 15', url: 'https://www.sebastiandaily.com/community/sebastian-police-to-host-community-night-out-on-oct-15-96040/' },
			{ label: 'Sebastian Daily — Haunted Tiki Tour set for Oct. 14', url: 'https://www.sebastiandaily.com/events/haunted-tiki-tour-set-for-oct-14-on-the-indian-river-lagoon-96000/' },
			{ label: 'Sebastian Daily — 60-day rabies alert after bat tests positive in Fellsmere', url: 'https://www.sebastiandaily.com/health/health-department-issues-60-day-rabies-alert-after-bat-tests-positive-in-fellsmere-95801/' },
			{ label: 'Citizen Portal — Sebastian council sets tentative millage at rollback rate of 3.3318 mills', url: 'https://citizenportal.ai/articles/9963111/florida/indian-river-county/sebastian/sebastian-council-sets-tentative-millage-at-rollback-rate-of-33318-mills' },
			{ label: 'Citizen Portal — Council adopts tentative FY2026–27 budget that uses reserves', url: 'https://citizenportal.ai/articles/9963109/florida/indian-river-county/sebastian/council-adopts-tentative-fy202627-budget-that-uses-reserves' },
			{ label: 'Citizen Portal — Council adopts final millage (3.4455 mills) and FY 2025–26 budget', url: 'https://citizenportal.ai/articles/5964266/Florida/Indian-River-County/Sebastian/Council-adopts-final-millage-34455-mills-and-FY-202526-budget-staff-and-residents-debate-reserves-and-spending' },
			{ label: 'Citizen Portal — Sebastian budget workshop flags $2.8M year-one hit under proposed property-tax amendment', url: 'https://citizenportal.ai/articles/8514072/florida/indian-river-county/sebastian/sebastian-budget-workshop-flags-28m-yearone-hit-under-proposed-propertytax-amendment' },
			{ label: 'WQCS — County forums on Amendment 3', url: 'https://www.wqcs.org/wqcs-news/2026-09-26/indian-river-county-to-hold-forums-on-amendment-3-and-local-impacts' },
			{ label: 'Florida DEP — Enhanced nutrient reducing septic systems and HB 1379', url: 'https://floridadep.gov/water/onsite-sewage/content/permitting-enhanced-nutrient-reducing-onsite-sewage-treatment-and' },
			{ label: 'Vero News — Septic-to-sewer workshops hope to clear up confusion', url: 'https://veronews.com/2026/09/03/septic-to-sewer-workshops-hope-to-clear-up-confusion/' },
			{ label: 'Indian River Guardian — City of Sebastian partnering with IRC on septic to sewer conversions', url: 'https://indianriverguardian.com/2025/09/03/city-of-sebastian-partnering-with-irc-on-septic-to-sewer-conversions/' },
			{ label: 'Indian River County Septic-to-Sewer Program', url: 'https://www.ircs2sprogram.com/projects/countywide' },
			{ label: 'U.S. Fish & Wildlife Service — Pelican Island National Wildlife Refuge', url: 'https://www.fws.gov/refuge/pelican-island/about-us' },
			{ label: 'NOAA National Hurricane Center', url: 'https://www.nhc.noaa.gov/' },
		],
	},
]

export const currentSebastianPorchIssue = sebastianPorchIssues[0]

/** Where the printed QR code points. utm tags let the attribution page count scans. */
export const SEBASTIAN_PORCH_QR_URL =
	'https://covenantbuilders.org/sebastian-porch?utm_source=sebastian-porch&utm_medium=print&utm_campaign=sebastian-porch-2026-10'
