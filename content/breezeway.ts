/**
 * THE BREEZEWAY — a monthly paper for Florida condominium owners and the
 * volunteer boards who run their associations, published by Covenant Builders.
 * Statewide. It never shares stories with the town papers (the Porches and
 * Balconies). Same house rules as content/porch.ts, plus:
 *
 * 1. Newspaper first; Covenant gets one box (components/porch/board-guide-box.tsx).
 *    Sponsor name + address printed.
 * 2. Every fact has a source in `sources`. Statute citations are checked against
 *    flsenate.gov the week the issue goes out. Deadlines change — re-check.
 * 3. Not legal advice. Say what the law says and who to ask; never tell a
 *    board what to decide.
 * 4. LICENCE SCOPE — OPEN QUESTION. Whether Covenant's CBC licence covers
 *    structural repair on 3+ story buildings (F.S. 489.105(3)(b)) is not yet
 *    answered by DBPR/CILB. Until it is, nothing in this paper may say or imply
 *    that Covenant does milestone or structural repair work.
 * 5. Roof/insurance copy follows F.S. §489.147 — no claim talk, gifts or rebates.
 * 6. Ballot items: facts and dates, never a recommendation.
 */

import type { PorchIssue } from '@/content/porch'

export const BREEZEWAY_NAME = 'The Breezeway'
export const BREEZEWAY_TAGLINE = 'News for Florida condo owners and boards'
export const BREEZEWAY_SPONSOR =
	'Published monthly by Covenant Builders · 876 47th Avenue, Vero Beach, FL 32966 · Florida Certified Building Contractor CBC1253676'

export const breezewayIssues: PorchIssue[] = [
	{
		slug: '2026-10',
		volume: 1,
		number: 1,
		monthLabel: 'October 2026',
		checkedOn: '2026-10-19',
		price: 'Free to Florida condo owners',
		lead: {
			slug: 'last-sirs-deadline',
			kicker: 'Reserves & SIRS',
			headline: 'The last SIRS deadline is December 31. After that, the law allows no more late ones.',
			dek: 'Most associations owed their structural integrity reserve study by the end of 2025. One narrow group got one more year. That year ends in ten weeks.',
			paragraphs: [
				'A SIRS — structural integrity reserve study — is the study that tells your association how much money to save for the big parts of the building: roof, structure, waterproofing, windows and doors, plumbing, electrical and fireproofing. Florida law requires one every 10 years for condo buildings three stories or taller.',
				'The first round was due December 31, 2025. The law made one exception: if your building also had a milestone inspection due by December 31, 2026, the association could do both at the same time and finish the SIRS with it. The statute then says no study may be completed after December 31, 2026. So if your building is in that group and the SIRS is not finished, the clock is running out.',
				'Once a SIRS is done, the association has 45 days to report it to the state through the Department of Business and Professional Regulation (DBPR) online system. The law does not set an automatic fine for missing the deadline. The risk is elsewhere: a board member who willfully and knowingly fails to get the study done breaches their duty to the owners, the state can bring civil penalties, and a budget built without it is not a lawful budget.',
				'There is a money side too. Since budgets adopted on or after December 31, 2024, owners can no longer vote to cut or skip the reserves the SIRS calls for. The SIRS number goes straight into what every owner pays.',
				'What to do this month: if you are an owner, ask your manager or board two questions in writing — "Is our SIRS finished?" and "Has it been reported to DBPR?" If you are on the board and the answer is no, call your engineer and your association attorney this week, not in December.',
			],
		},
		briefs: [
			{
				slug: 'budget-season',
				kicker: 'Board rules',
				headline: 'Budget season: 14 days’ notice, and the 115% rule',
				body: 'Most associations adopt next year’s budget this fall. Florida law requires the proposed budget and the meeting notice to reach every owner at least 14 days before the meeting. If the new budget would raise assessments above 115% of last year’s, the board must also offer a substitute budget with no discretionary spending, sent by mail or hand delivery. Owners pick the substitute only by a majority of all voting interests. Required reserves, SIRS items and insurance premiums don’t count toward the 115%.',
			},
			{
				slug: 'fannie-mae-15',
				kicker: 'Selling or refinancing',
				headline: 'January 4: Fannie Mae’s condo reserve bar rises to 15%',
				body: 'For Fannie Mae-backed loans with applications on or after January 4, 2027, a condo project must budget at least 15% of its assessment income for reserves, up from 10%, or fund at the highest level its reserve study recommends. Fannie Mae has already ended its “limited review” for most projects over 10 units. If your budget falls short, buyers and owners who refinance in your building may struggle to get a conventional loan.',
			},
			{
				slug: 'citizens-clearinghouse',
				kicker: 'Condo insurance',
				headline: 'Citizens condo policies get a clearinghouse by 2027',
				body: 'A law signed June 16, 2026 tells Citizens Property Insurance to build a clearinghouse for condo association and commercial policies by January 1, 2027. If a private insurer offers coverage within 15% of the Citizens rate, the policy must move to that private company. Separately, Citizens raised condo association rates from July 1, 2026: an average of 7.7% for multiperil and 14.1% for wind-only policies.',
			},
			{
				slug: 'amendment-3',
				kicker: 'On the ballot',
				headline: 'Amendment 3 and condo units: what it would change',
				body: 'Amendment 3 on the November 3 ballot would raise the homestead exemption on non-school taxes to $150,000 in 2027 and $250,000 in 2028. For units that are not a homestead — second homes and rentals — it would cut the yearly cap on assessed-value increases from 10% to 5%. It needs 60% of the vote to pass. It would not change association fees.',
			},
		],
		storm: {
			slug: 'season-ends-nov-30',
			kicker: 'Storms & safety',
			headline: 'Six weeks of hurricane season left. Four things for the board to have on file.',
			dek: 'The Atlantic season runs through November 30. A quiet month is the cheapest time to get the building’s paperwork in one place.',
			paragraphs: [
				'Late-season storms still reach Florida. For a condo building, the hard part after a storm is rarely the cleanup. It is finding the documents the board needs, fast, while owners are calling.',
				'None of this costs money. It takes one board meeting and a shared folder.',
			],
			list: [
				{
					title: 'Dated photos of the building',
					body: 'Every elevation, the roof, breezeways, balconies, garage, pool deck and equipment rooms. Store them off-site, not only on the manager’s laptop.',
				},
				{
					title: 'The latest milestone and SIRS reports',
					body: 'They show what condition the building was in before the storm. Keep a copy where every director can reach it.',
				},
				{
					title: 'A current owner contact list',
					body: 'Phone and email for every unit, plus who is out of state for the season. You will need it for emergency notices.',
				},
				{
					title: 'Who can act in an emergency',
					body: 'Florida law gives boards extra emergency powers after a declared state of emergency. Ask your association attorney now which ones apply to your building, and write the answer down.',
				},
			],
		},
		history: {
			slug: 'how-we-got-here',
			kicker: 'How we got here',
			headline: 'From one night in Surfside to the letters in your mailbox',
			dek: 'Every rule in this paper traces back to June 24, 2021.',
			paragraphs: [
				'Shortly after 1 a.m. on June 24, 2021, part of Champlain Towers South, a 12-story condominium in Surfside, collapsed. Ninety-eight people died. It soon came out that serious structural damage had been reported to the association years earlier, and the major repairs had not yet been done.',
				'Florida answered with SB 4-D, signed May 26, 2022. It created milestone inspections for condo buildings three stories and taller and required structural integrity reserve studies, and it ended the long-standing practice of owners voting to skip reserves for structural items.',
				'SB 154, signed June 9, 2023, adjusted the rules — including dropping the automatic 25-year inspection trigger for buildings within three miles of the coast and setting 30 years statewide, unless a local building official chooses 25. HB 913 in 2025 then gave associations new tools to pay for repairs: loans and lines of credit, and a temporary pause on reserves after a milestone inspection — each with an owner vote.',
				'A state report from July 2026 counted 8,736 Phase 1 and 1,575 Phase 2 milestone inspections completed so far, and 54 buildings found unsafe or uninhabitable in 2024 and 2025.',
			],
		},
		askTheBuilder: {
			slug: 'milestone-vs-sirs',
			kicker: 'Ask the builder',
			headline: '"What is the difference between a milestone inspection and a SIRS?"',
			dek: 'One looks at the building today. The other plans the money for tomorrow.',
			paragraphs: [
				'A milestone inspection is about safety right now. A licensed engineer or architect inspects the building when it turns 30 years old (25 where the local building official requires it), then every 10 years. Phase 1 is a visual inspection. If it finds substantial structural deterioration, Phase 2 follows with closer testing and a list of repairs. The report goes to your local building department.',
				'A SIRS is about money. It looks at the building’s big components, estimates how long each one will last and what it will cost to replace, and sets how much the association must save each year. It goes to the state.',
				'The two often happen together, and the law lets them. But they answer different questions: "Is the building safe?" and "Can we afford to keep it that way?"',
				'Have a question about your building? Text it to (772) 766-1917 and we may answer it in a future issue.',
			],
		},
		events: [
			{ when: 'Oct 19 – Nov 1', what: 'Early voting for the Nov. 3 general election (Amendment 3 on the ballot)', where: 'Your county’s Supervisor of Elections sites' },
			{ when: 'Tue, Nov 3', what: 'Election Day', where: 'Your assigned polling place' },
			{ when: 'Mon, Nov 30', what: 'Atlantic hurricane season ends', where: 'Statewide' },
			{ when: 'Thu, Dec 31', what: 'Last day a SIRS may be completed (buildings with a milestone due by this date)', where: 'F.S. 718.112(2)(g)' },
			{ when: '45 days after a SIRS', what: 'Report the completed SIRS to DBPR', where: 'DBPR online reporting system' },
			{ when: 'Fri, Jan 1, 2027', what: 'Citizens condo & commercial clearinghouse due', where: 'Citizens Property Insurance' },
			{ when: 'Mon, Jan 4, 2027', what: 'Fannie Mae condo reserve requirement rises to 15% (by loan application date)', where: 'Fannie Mae Selling Guide' },
		],
		sources: [
			{ label: 'Florida Statutes §718.112 (2026) — bylaws, budgets, reserves, SIRS', url: 'https://www.flsenate.gov/Laws/Statutes/2026/0718.112' },
			{ label: 'Florida Statutes §718.111 (2026) — association websites and records', url: 'https://www.flsenate.gov/Laws/Statutes/2026/0718.111' },
			{ label: 'DBPR — Condominium SIRS reporting', url: 'https://www2.myfloridalicense.com/condominiums/condominiums-and-cooperatives-sirs-reporting/' },
			{ label: 'DBPR — Building Reporting Database', url: 'https://www2.myfloridalicense.com/condos-timeshares-mobile-homes/building-report/' },
			{ label: 'OPPAGA Report 26-04 — Condominium milestone inspections (July 2026)', url: 'https://oppaga.fl.gov/Products/ReportDetail?rn=26-04' },
			{ label: 'Fannie Mae — 2026 Selling Guide policy updates summary (LL-2026-03)', url: 'https://singlefamily.fanniemae.com/media/document/pdf/case-you-missed-it-summary-2026-selling-guide-servicing-guide-policy-updates' },
			{ label: 'Fannie Mae — Lender Letter LL-2026-03', url: 'https://singlefamily.fanniemae.com/news-events/lender-letter-ll-2026-03-updates-project-standards-property-insurance-requirements' },
			{ label: 'Observer — DeSantis signs bill to push more commercial policies out of Citizens (June 18, 2026)', url: 'https://www.observerlocalnews.com/news/2026/jun/18/desantis-signs-bill-to-push-more-commercial-policies-out-of-citizens/' },
			{ label: 'Citizens Property Insurance — 2026 rate and rule changes', url: 'https://www.citizensfla.com/-/20260430-2026-rate-and-rule-changes' },
			{ label: 'City of Port St. Lucie — Amendment 3: what Florida voters should know', url: 'https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Manager/Amendment-3-What-Florida-Voters-Should-Know' },
			{ label: 'Florida Phoenix — 2026 Amendment 3 voter guide', url: 'https://floridaphoenix.com/voter-guides/ballot-measures/2026-amendment-3/' },
			{ label: 'The Florida Bar Journal — Senate Bill 4-D and the Champlain Towers South disaster', url: 'https://www.floridabar.org/the-florida-bar-journal/senate-bill-4-d-and-the-champlain-towers-south-disaster-a-problem-in-response-to-a-problem/' },
			{ label: 'CBS Miami — DeSantis signs condo safety changes (SB 154, June 2023)', url: 'https://www.cbsnews.com/miami/news/gov-desantis-signs-condo-safety-changes/' },
		],
	},
]

export const currentBreezewayIssue = breezewayIssues[0]

/** Where the printed QR code points. utm tags let the attribution page count scans. */
export const BREEZEWAY_QR_URL =
	'https://covenantbuilders.org/breezeway?utm_source=breezeway&utm_medium=print&utm_campaign=breezeway-2026-10'
