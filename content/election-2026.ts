import type { PorchBlock } from '@/lib/porch-articles'
import type { PorchEditionKey } from '@/lib/porch-articles'

/**
 * The Porch — Election Edition, Nov. 3, 2026.
 *
 * A special one-page ballot guide per paper, kept apart from the daily
 * articles (it does not live in the article folders, so the daily run is not
 * affected). Served at /<paper>/election-2026 from `liveFrom` on; the front
 * page shows a banner to it until `bannerUntil`.
 *
 * RULES (same as every Porch article, plus SOP 4's election row):
 * facts, dates and where to learn more only. Never how to vote. Candidates in
 * ballot or alphabetical order, with no descriptions of anyone's positions.
 * If a name could not be verified from an official or news source, leave it
 * out and send readers to their sample ballot.
 */

export interface ElectionEdition {
	slug: 'election-2026'
	title: string
	seoTitle: string
	description: string
	dek: string
	/** America/New_York date the page goes live. */
	liveFrom: string
	/** Last day the front-page banner shows. */
	bannerUntil: string
	checkedOn: string
	body: PorchBlock[]
	faq: { q: string; a: string }[]
	sources: { label: string; url: string }[]
	/** Ready for the Facebook auto-poster or to paste by hand. No link. */
	facebook: string
	facebookAt: string
}

const HOW_TO_VOTE_SITES =
	'Use any of four sites: the Main Library, 1600 21st St., Vero Beach; the Supervisor of Elections office, 4375 43rd Ave., Vero Beach; the Intergenerational Recreation Center, Room 112, 1590 9th St. SW, Vero Beach; or Sebastian City Hall Council Chambers, 1225 Main St., Sebastian.'

const STATE_AND_FEDERAL: PorchBlock[] = [
	{ type: 'h2', text: 'Federal races' },
	{
		type: 'ul',
		items: [
			'U.S. Senate (a special election to finish Marco Rubio’s term, which runs through January 2029): Ashley Moody (Republican), Angie Nixon (Democrat), Neil J. Gillespie (No Party Affiliation).',
			'U.S. House, District 9: Dan Green (Republican) and Darren Soto (Democrat, incumbent). Florida redrew its congressional map in April 2026.',
		],
	},
	{ type: 'h2', text: 'State races' },
	{
		type: 'ul',
		items: [
			'Governor and Lt. Governor: Byron Donalds and Bryan Avila (Republican); David Jolly and Gwen Graham (Democrat); Scott Eckhard Jewett and Nicole Skelly (Libertarian); and five No Party Affiliation tickets: Charles Burkett and Ruben A. Coto, Frank J. Russo and Rachel Rodriguez, Moliere “Moe” Dimanche and Benjiman Rojas, Dean Ocean Abrams and Joe Van Vactor, and Jeffrey Peter “Dr. Jeff” Datto and Juan Santana.',
			'Attorney General: James Uthmeier (Republican), Jose Javier Rodriguez (Democrat).',
			'Chief Financial Officer: Blaise Ingoglia (Republican), Annette Taddeo (Democrat).',
			'Commissioner of Agriculture: Wilton Simpson (Republican), Joey Mendoza Atkins (Democrat).',
			'State House, District 34: Robbie Brackett (Republican, incumbent), Jordyn Guadalupe Balderas (Democrat). There is no state Senate race on this year’s Indian River County ballot.',
		],
	},
	{ type: 'h2', text: 'Judges: yes or no on keeping each one' },
	{
		type: 'p',
		text: 'Florida judges do not run against opponents in these races. You vote yes or no on whether each one keeps the job. On the ballot: Florida Supreme Court Chief Justice Carlos G. Muñiz, and five judges of the 4th District Court of Appeal, which hears appeals from Indian River County: Alan O. Forst, Mark W. Klingensmith, Johnathan D. Lott, Shannon K. Shaw and Caroline Cahill Shepherd.',
	},
]

const AMENDMENTS: PorchBlock[] = [
	{ type: 'h2', text: 'The three state constitutional amendments' },
	{
		type: 'p',
		text: 'The Legislature put all three on the ballot. Each needs at least 60% of the statewide vote to pass. Here is what a “yes” would do, in plain words. A “no” keeps things as they are.',
	},
	{
		type: 'ul',
		items: [
			'Amendment 1, Budget Stabilization Fund: raises the cap on the state’s rainy-day savings fund from 10% to 25% of general revenue, and requires the Legislature to set money aside each year (the lesser of $750 million or what is needed to reach the cap), with some exceptions.',
			'Amendment 2, Exemption of Tangible Personal Property on Agricultural Land from Taxation: exempts farm equipment and similar property kept on agricultural land and used for farming or agritourism from property tax, starting with tax year 2027.',
			'Amendment 3, Increased Homestead Exemption; Lower Cap on Increases in Non-Homestead Property Assessments: raises the homestead exemption on non-school property taxes to $150,000 in 2027 and $250,000 in 2028, then adjusts it for inflation. It lowers the yearly cap on assessment increases for rentals, second homes and business property from 10% to 5%, and limits how local governments may use property tax money. It would take effect Jan. 1, 2027.',
		],
	},
]

export const ELECTION_2026: Partial<Record<PorchEditionKey, ElectionEdition>> = {
	vero: {
		slug: 'election-2026',
		title: 'Your Nov. 3 ballot in Vero Beach: every race, every question, and where to vote',
		seoTitle: 'Vero Beach Ballot Guide: Nov. 3, 2026 Election',
		description:
			'Every race and question on the Nov. 3, 2026 ballot in Vero Beach, from the U.S. Senate to City Council and Amendment 3, plus early voting sites and hours.',
		dek: 'From the governor down to three Vero Beach City Council seats and a property tax amendment, here is what is on the ballot and how to cast yours. Just the facts. The choices are yours.',
		liveFrom: '2026-10-26',
		bannerUntil: '2026-11-03',
		checkedOn: '2026-10-23',
		facebook:
			'Long ballot this year, Vero Beach. From the governor to three City Council seats and a homestead tax amendment, here is every item in order, plus early voting hours and where to drop off a mail ballot. No spin, just the facts.',
		facebookAt: '2026-10-26T11:30',
		body: [
			{
				type: 'callout',
				title: 'The dates',
				text: 'Early voting runs through Saturday, Oct. 31, 8 a.m. to 4 p.m., and until 6 p.m. on Thursday, Oct. 29. Election Day is Tuesday, Nov. 3, with polls open 7 a.m. to 7 p.m. Mail ballots must arrive by 7 p.m. on Nov. 3.',
			},
			{
				type: 'p',
				text: 'A Vero Beach ballot is long this year. It runs from the U.S. Senate down to the City Council and three proposed changes to the Florida Constitution. Here is every item, so nothing surprises you in the booth.',
			},
			{
				type: 'p',
				text: 'This guide sticks to the facts: who and what is on the ballot, and how to vote. It does not tell you how to vote. Your exact ballot depends on where you live, so look up your own sample ballot at voteindianriver.gov.',
			},
			{ type: 'h2', text: 'How to vote' },
			{
				type: 'ul',
				items: [
					`Early voting: through Saturday, Oct. 31, 8 a.m. to 4 p.m., and until 6 p.m. on Thursday, Oct. 29. ${HOW_TO_VOTE_SITES}`,
					'Election Day: Tuesday, Nov. 3, 7 a.m. to 7 p.m., at your own assigned polling place only. It may not be the place you voted last time.',
					'Mail ballots: the deadline to request one has passed. If you have one, it must arrive by 7 p.m. on Nov. 3. Drop it at the secure ballot intake station at any early voting site during early voting hours, or at the Supervisor of Elections office. Polling places do not accept mail ballots on Election Day.',
					'What to bring: a photo ID with your signature, such as a Florida driver license or ID card, U.S. passport, or a military or student ID. If your photo ID has no signature, bring a second ID that does. Without proper ID you can still vote a provisional ballot.',
				],
			},
			...STATE_AND_FEDERAL,
			{ type: 'h2', text: 'County races' },
			{
				type: 'ul',
				items: [
					'County Commission, District 2 (an open seat; Commissioner Joe Flescher is not running again): Jennifer Pippin (Republican), Robbie Hardingham (Democrat), plus a write-in candidate.',
					'County Commission, District 4: Deryl Loar (Republican, incumbent), Marc Jaffe (Democrat).',
					'Indian River Mosquito Control District, Seat 2, a nonpartisan race. Check your sample ballot for the names.',
					'There is no school board race on the Nov. 3 ballot.',
				],
			},
			{ type: 'h2', text: 'Vero Beach City Council' },
			{
				type: 'p',
				text: 'If you live inside Vero Beach city limits, you can vote for up to three of these eight candidates for three seats, each a two-year term. They are listed in alphabetical order: Davis Benedict, Brian Heady, Jay Kramer, Robert MacCallum, Linda Moore (incumbent), John O’Connor, Aaron Vos (incumbent) and Tracey Zudans.',
			},
			{
				type: 'p',
				text: 'Council member John Carroll is not running again. Vero Beach voters do not elect the mayor directly. The new council picks a mayor from among its members. A Vero Beach mailing address does not always mean you live in the city; if this race is on your sample ballot, you do.',
			},
			...AMENDMENTS,
			{ type: 'h2', text: 'What to do this week' },
			{
				type: 'ol',
				items: [
					'Look up your sample ballot and your Election Day polling place at voteindianriver.gov, or call the Supervisor of Elections at 772-226-4700 (Spanish: 833-347-2763).',
					'Read every item at home first. The amendments are long, and the full text is in the state’s 2026 amendment booklet.',
					'Pick your time. Weekday early voting is usually the quickest, and Thursday, Oct. 29 runs until 6 p.m.',
					'If you have a mail ballot, return it in person at an early voting site or the elections office so it arrives in time.',
					'Bring a photo ID with your signature.',
				],
			},
		],
		faq: [
			{
				q: 'When is early voting in Vero Beach for the Nov. 3, 2026 election?',
				a: 'Through Saturday, Oct. 31, 8 a.m. to 4 p.m., and until 6 p.m. on Thursday, Oct. 29, at the Main Library, the Supervisor of Elections office, the Intergenerational Recreation Center and Sebastian City Hall. Any registered Indian River County voter can use any site.',
			},
			{
				q: 'Who is running for Vero Beach City Council in 2026?',
				a: 'Eight candidates for three seats: Davis Benedict, Brian Heady, Jay Kramer, Robert MacCallum, Linda Moore, John O’Connor, Aaron Vos and Tracey Zudans. Voters inside city limits can pick up to three.',
			},
			{
				q: 'Where can I drop off my mail ballot in Indian River County?',
				a: 'At the secure ballot intake station at any early voting site during early voting hours, or at the Supervisor of Elections office, 4375 43rd Ave. It must arrive by 7 p.m. on Nov. 3. Polling places do not accept mail ballots on Election Day.',
			},
			{
				q: 'What does Amendment 3 do in Florida in 2026?',
				a: 'It would raise the homestead exemption on non-school property taxes to $150,000 in 2027 and $250,000 in 2028, then adjust it for inflation, and lower the yearly assessment cap for non-homestead property from 10% to 5%. It needs 60% of the statewide vote to pass.',
			},
		],
		sources: [
			{ label: 'Indian River County Supervisor of Elections — Early voting', url: 'https://www.voteindianriver.gov/election_information/early_voting_information.php' },
			{ label: 'Indian River County Supervisor of Elections — Election Day voting and ID', url: 'https://www.voteindianriver.gov/election_information/election_day_voting.php' },
			{ label: 'Indian River County Supervisor of Elections — Vote by mail', url: 'https://www.voteindianriver.gov/election_information/vote_by_mail_ballot/index.php' },
			{ label: 'Indian River Guardian — Sample ballots for Nov. 3 general election in the mail (Oct. 14, 2026)', url: 'https://indianriverguardian.com/2026/10/14/sample-ballots-for-november-3-general-election-in-the-mail/' },
			{ label: 'Florida Department of State — Certification of Nov. 3 candidates (Aug. 28, 2026)', url: 'https://www.votehillsborough.gov/DocumentCenter/View/2611/Ballot-Certification-Department-of-State-PDF' },
			{ label: 'Florida Division of Elections — 2026 constitutional amendments booklet', url: 'https://files.floridados.gov/media/711355/eng-2026-booklet-constitutional-amendpub-updated-20260821.pdf' },
			{ label: 'Florida TaxWatch — 2026 guide to the three amendments', url: 'https://floridataxwatch.org/florida-taxwatch-releases-2026-voter-guide-to-floridas-three-constitutional-amendments-appearing-on-the-november-general-election-ballot/' },
			{ label: 'Ballotpedia News — U.S. Senate special election in Florida', url: 'https://news.ballotpedia.org/2026/08/28/special-election-to-fill-the-remainder-of-sec-of-state-marco-rubios-u-s-senate-term-happening-in-florida-on-nov-3/' },
			{ label: 'Central Florida Public Media — Congressional District 9', url: 'https://www.cfpublic.org/politics/2026-09-29/congressional-district-9-debrief' },
			{ label: 'WKMG — 2026 voters guide, Florida House District 34', url: 'https://www.clickorlando.com/voters-guide/2026/10/16/2026-voters-guide-florida-house-district-34/' },
			{ label: 'The Florida Bar News — Merit retention 2026', url: 'https://www.floridabar.org/the-florida-bar-news/justice-muniz-and-22-dca-judges-to-stand-for-merit-retention/' },
			{ label: 'Sebastian Daily — County Commission District 2 primary results', url: 'https://www.sebastiandaily.com/business/pippin-wins-indian-river-county-district-2-primary-rosario-reelected-to-school-board-94985/' },
			{ label: 'City of Vero Beach — Candidates for City Council 2026', url: 'https://www.covb.org/659/Candidates-For-City-Council-2026' },
			{ label: 'Vero News — 8 candidates contend for 3 seats on Vero Beach City Council', url: 'http://veronews.com/2026/10/19/8-candidates-contend-for-3-seats-on-vero-beach-city-council/' },
		],
	},
	sebastian: {
		slug: 'election-2026',
		title: 'Your Nov. 3 ballot in Sebastian: two council seats, three charter questions, and everything above them',
		seoTitle: 'Sebastian Ballot Guide: Nov. 3, 2026 Election',
		description:
			'Every race and question on the Nov. 3, 2026 Sebastian ballot: two City Council seats, three city charter questions, Amendment 3 and early voting at City Hall.',
		dek: 'Sebastian voters will pick two council members and decide three changes to the city charter, on the same ballot as the governor’s race and three state amendments. Here is every item and where to vote, starting at City Hall.',
		liveFrom: '2026-10-26',
		bannerUntil: '2026-11-03',
		checkedOn: '2026-10-23',
		facebook:
			'Sebastian, your ballot has two council seats and three city charter questions that only Sebastian voters decide. Here is every item in plain words, plus early voting hours at City Hall and where to drop a mail ballot.',
		facebookAt: '2026-10-26T17:30',
		body: [
			{
				type: 'callout',
				title: 'Vote early, right here in town',
				text: 'Sebastian City Hall Council Chambers, 1225 Main St., is an early voting site through Saturday, Oct. 31, 8 a.m. to 4 p.m., and until 6 p.m. on Thursday, Oct. 29. Election Day is Tuesday, Nov. 3, 7 a.m. to 7 p.m.',
			},
			{
				type: 'p',
				text: 'This year’s Sebastian ballot has a few items only Sebastian voters will see: two City Council seats and three questions about the city charter. Here is everything on it, so you can read it at home first.',
			},
			{
				type: 'p',
				text: 'This guide sticks to the facts: who and what is on the ballot, and how to vote. It does not tell you how to vote. Your exact ballot depends on your address, so look up your own sample ballot at voteindianriver.gov.',
			},
			{ type: 'h2', text: 'How to vote' },
			{
				type: 'ul',
				items: [
					`Early voting: through Saturday, Oct. 31, 8 a.m. to 4 p.m., and until 6 p.m. on Thursday, Oct. 29. ${HOW_TO_VOTE_SITES}`,
					'Election Day: Tuesday, Nov. 3, 7 a.m. to 7 p.m., at your own assigned polling place only.',
					'Mail ballots: the deadline to request one has passed. If you have one, it must arrive by 7 p.m. on Nov. 3. Drop it at the secure ballot intake station at City Hall during early voting hours, or at the Supervisor of Elections office in Vero Beach. Polling places do not accept mail ballots on Election Day.',
					'What to bring: a photo ID with your signature. If your photo ID has no signature, bring a second ID that does. Without proper ID you can still vote a provisional ballot.',
				],
			},
			{ type: 'h2', text: 'Only on Sebastian ballots: City Council' },
			{
				type: 'p',
				text: 'Two at-large, nonpartisan seats, each a two-year term. At-large means the whole city votes on both seats. You can vote for up to two of these five candidates, listed in alphabetical order: Robert Gable, Damien Gilliams, Richard Gillmor, Sherrie Matthews (incumbent) and Deborah Shellenberger.',
			},
			{
				type: 'p',
				text: 'Council member Ed Dodd is not on the ballot. After the election, the five council members choose the mayor and vice mayor from among themselves. A 73-minute recording of the Oct. 2 candidate forum is on Sebastian Daily’s YouTube channel and Facebook page.',
			},
			{ type: 'h2', text: 'Only on Sebastian ballots: three charter questions' },
			{
				type: 'p',
				text: 'The Supervisor of Elections lists City of Sebastian Referendum Questions 1, 2 and 3 on the Nov. 3 ballot. Each asks whether to change the city charter, the city’s basic rulebook.',
			},
			{
				type: 'p',
				text: 'The changes came from the city’s Charter Review Committee. In May, the City Council sent them on to be written up as ballot questions. It kept the committee’s changes on council residency and struck two proposed rules on who could not run for office. Readings were scheduled for June and July.',
			},
			{
				type: 'p',
				text: 'Because the final wording matters, read each question in full on your sample ballot before you vote. Questions about what they mean can go to the Sebastian City Clerk at City Hall, 1225 Main St.',
			},
			{ type: 'h2', text: 'County and special district races' },
			{
				type: 'ul',
				items: [
					'County Commission, District 2 (an open seat; Commissioner Joe Flescher is not running again): Jennifer Pippin (Republican), Robbie Hardingham (Democrat), plus a write-in candidate.',
					'County Commission, District 4: Deryl Loar (Republican, incumbent), Marc Jaffe (Democrat).',
					'Sebastian Inlet District, Seat 5, a nonpartisan race. Voters inside the district in both Brevard and Indian River counties elect its commissioners. Check your sample ballot for the names.',
					'Indian River Mosquito Control District, Seat 2, a nonpartisan race. Check your sample ballot for the names.',
					'There is no school board race on the Nov. 3 ballot.',
				],
			},
			...STATE_AND_FEDERAL,
			...AMENDMENTS,
			{ type: 'h2', text: 'What to do this week' },
			{
				type: 'ol',
				items: [
					'Look up your sample ballot and your Election Day polling place at voteindianriver.gov, or call the Supervisor of Elections at 772-226-4700 (Spanish: 833-347-2763). If the Sebastian council race is on it, you live inside city limits.',
					'Read the three charter questions in full at home. They are short, but every word counts.',
					'Watch the candidate forum recording if you want to hear the council candidates in their own words.',
					'Vote early at City Hall, or return your mail ballot there during early voting hours.',
					'Bring a photo ID with your signature.',
				],
			},
		],
		faq: [
			{
				q: 'Where can I vote early in Sebastian?',
				a: 'Sebastian City Hall Council Chambers, 1225 Main St., through Saturday, Oct. 31, 8 a.m. to 4 p.m., and until 6 p.m. on Thursday, Oct. 29. Any registered Indian River County voter can also use the three early voting sites in Vero Beach.',
			},
			{
				q: 'Who is running for Sebastian City Council in 2026?',
				a: 'Five candidates for two at-large seats: Robert Gable, Damien Gilliams, Richard Gillmor, Sherrie Matthews and Deborah Shellenberger. Voters inside city limits can pick up to two.',
			},
			{
				q: 'What are the Sebastian referendum questions on the 2026 ballot?',
				a: 'City of Sebastian Referendum Questions 1, 2 and 3 ask whether to change the city charter, based on recommendations from the city’s Charter Review Committee. Read the full wording on your sample ballot at voteindianriver.gov.',
			},
			{
				q: 'Where can I drop off my mail ballot in Sebastian?',
				a: 'At the secure ballot intake station at Sebastian City Hall during early voting hours, or at the Supervisor of Elections office in Vero Beach. It must arrive by 7 p.m. on Nov. 3. Polling places do not accept mail ballots on Election Day.',
			},
		],
		sources: [
			{ label: 'Indian River County Supervisor of Elections — Early voting', url: 'https://www.voteindianriver.gov/election_information/early_voting_information.php' },
			{ label: 'Indian River County Supervisor of Elections — Election Day voting and ID', url: 'https://www.voteindianriver.gov/election_information/election_day_voting.php' },
			{ label: 'Indian River County Supervisor of Elections — Vote by mail', url: 'https://www.voteindianriver.gov/election_information/vote_by_mail_ballot/index.php' },
			{ label: 'Indian River Guardian — Sample ballots for Nov. 3 general election in the mail (Oct. 14, 2026)', url: 'https://indianriverguardian.com/2026/10/14/sample-ballots-for-november-3-general-election-in-the-mail/' },
			{ label: 'Citizen Portal — Sebastian council sends revised charter amendments to ballot language (May 27, 2026)', url: 'https://citizenportal.ai/articles/8064030/Florida/Indian-River-County/Sebastian/Council-sends-revised-charter-amendments-to-ballot-language-strikes-two-proposed-disqualifiers' },
			{ label: 'WQCS — Sebastian charter changes (June 16, 2026)', url: 'https://www.wqcs.org/wqcs-news/2026-06-16/sebastian-charter-changes-would-raise-council-pay-tighten-eligibility-requirements' },
			{ label: 'Sebastian Daily — Five Sebastian council candidates face voters', url: 'https://www.sebastiandaily.com/business/five-sebastian-council-candidates-face-voters-on-growth-taxes-and-the-lagoon-95985/' },
			{ label: 'Sebastian Inlet District — Board of Commissioners', url: 'https://www.sitd.us/board-of-commissioners' },
			{ label: 'Florida Department of State — Certification of Nov. 3 candidates (Aug. 28, 2026)', url: 'https://www.votehillsborough.gov/DocumentCenter/View/2611/Ballot-Certification-Department-of-State-PDF' },
			{ label: 'Florida Division of Elections — 2026 constitutional amendments booklet', url: 'https://files.floridados.gov/media/711355/eng-2026-booklet-constitutional-amendpub-updated-20260821.pdf' },
			{ label: 'Central Florida Public Media — Congressional District 9', url: 'https://www.cfpublic.org/politics/2026-09-29/congressional-district-9-debrief' },
			{ label: 'WKMG — 2026 voters guide, Florida House District 34', url: 'https://www.clickorlando.com/voters-guide/2026/10/16/2026-voters-guide-florida-house-district-34/' },
			{ label: 'The Florida Bar News — Merit retention 2026', url: 'https://www.floridabar.org/the-florida-bar-news/justice-muniz-and-22-dca-judges-to-stand-for-merit-retention/' },
			{ label: 'Sebastian Daily — County Commission District 2 primary results', url: 'https://www.sebastiandaily.com/business/pippin-wins-indian-river-county-district-2-primary-rosario-reelected-to-school-board-94985/' },
		],
	},
}

export function todayInVero(now = new Date()) {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now)
}

/** The edition for a paper, only once it is live. */
export function getLiveElectionEdition(key: PorchEditionKey, now = new Date()): ElectionEdition | undefined {
	const e = ELECTION_2026[key]
	return e && e.liveFrom <= todayInVero(now) ? e : undefined
}
