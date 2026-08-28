'use client'

import { useRef, useState } from 'react'

import { SectionHeading } from '@/components/section-heading'

type Contact = { label: string; href?: string }

type Status = {
	label: string
	tone: 'open' | 'soon' | 'closed' | 'check'
}

type Program = {
	name: string
	summary: string
	access?: string[]
	contact: Contact[]
	status?: Status
}

type Bucket = {
	id: string
	eyebrow: string
	title: string
	description: string
	programs: Program[]
}

type CountyGroup = {
	id: string
	name: string
	note?: string
	programs: Program[]
}

type Region = {
	id: string
	eyebrow: string
	title: string
	description: string
	groups: CountyGroup[]
}

const OPEN: Status = { label: 'Open now', tone: 'open' }
const CLOSED: Status = { label: 'Closed / waitlist', tone: 'closed' }
const PAUSED: Status = { label: 'Paused — check back', tone: 'closed' }
const CHECK: Status = { label: 'Call to check', tone: 'check' }

const statusStyles: Record<Status['tone'], string> = {
	open: 'bg-emerald-50 text-emerald-800 border-emerald-200',
	soon: 'bg-amber-50 text-amber-800 border-amber-200',
	closed: 'bg-rose-50 text-rose-800 border-rose-200',
	check: 'bg-navy/5 text-navy/70 border-navy/15',
}

const buckets: Bucket[] = [
	{
		id: 'harden',
		eyebrow: 'Statewide · Harden your home',
		title: 'Money to strengthen your home before the storm',
		description:
			'Florida pays property owners to make their homes stronger. These programs fund impact windows and doors, roof-to-wall strapping, and stronger roofing — and completed upgrades usually earn insurance discounts too.',
		programs: [
			{
				name: 'My Safe Florida Home (MSFH)',
				summary:
					'A free wind-mitigation inspection of your home, then a grant of up to $10,000 toward approved wind-hardening upgrades. Most property owners get a 2-to-1 match — the state pays $2 for every $1 you spend — and low-income owners can qualify with no match required. The 2026 state budget put roughly $378 million back into the program, and the application portal is open for the 2026–27 year.',
				access: [
					'Apply free at mysafeflhome.com — it takes minutes.',
					'The state schedules your free wind-mitigation inspection and sends a report of qualifying upgrades.',
					'Once your grant is approved — and only then — choose a contractor and complete the work.',
					'Submit invoices for reimbursement. We help our clients with quotes, wind-mitigation documentation, and closeout paperwork.',
				],
				contact: [{ label: 'mysafeflhome.com', href: 'https://mysafeflhome.com' }],
				status: OPEN,
			},
			{
				name: 'My Safe Florida Condo (pilot)',
				summary:
					'The condominium version of MSFH for buildings three habitable stories and up. The association applies — not individual unit owners — and grants fund wind-hardening of common elements like roofs and openings. The pilot continues with about $27 million in fresh 2026 funding. If your board is already planning milestone or SIRS repairs, this can offset the hardening portion of the project.',
				access: [
					'Your association board applies at mysafeflcondo.com.',
					'Ask us how the pilot pairs with milestone inspection repairs — we work with condo boards across the Treasure Coast.',
				],
				contact: [{ label: 'mysafeflcondo.com', href: 'https://mysafeflcondo.com' }],
				status: OPEN,
			},
			{
				name: 'Weatherization Assistance Program (WAP)',
				summary:
					'Free energy-related repairs — insulation, air sealing, A/C and water-heater work — for income-qualified households, delivered through local community agencies under FloridaCommerce. The local provider for your county is listed in the regional sections below.',
				access: [
					'Find your county’s provider through the FloridaCommerce locator, or use the regional listings below.',
				],
				contact: [
					{
						label: 'FloridaCommerce — Weatherization',
						href: 'https://www.floridajobs.org/community-planning-and-development/community-services/weatherization-assistance-program',
					},
				],
				status: OPEN,
			},
			{
				name: 'Elevate Florida (FDEM)',
				summary:
					'The state’s home-elevation and mitigation-reconstruction program drew over 12,000 applications in early 2025 and has been closed to new applications since April 2025, with existing awards delayed in federal review. We list it so you don’t chase it: if you already applied, check your status; if you didn’t, My Safe Florida Home is the live hardening option.',
				access: [
					'Existing applicants only: check status through the Elevate Florida portal or call 877-353-8835.',
				],
				contact: [
					{
						label: 'floridadisaster.org — Elevate Florida',
						href: 'https://www.floridadisaster.org/dem/mitigation/elevate-Florida/',
					},
					{ label: '877-353-8835' },
				],
				status: { label: 'Closed to new applicants', tone: 'closed' },
			},
		],
	},
	{
		id: 'disputes',
		eyebrow: 'Statewide · When a claim goes wrong',
		title: 'Free state help with insurance disputes',
		description:
			'If your property insurance claim is stalled, underpaid, or denied, the State of Florida gives you free tools most property owners have never heard of. You do not have to face the insurance company alone.',
		programs: [
			{
				name: 'DFS Residential Property Mediation',
				summary:
					'A free, state-run mediation program for residential property claims. The insurance company pays the entire cost. A neutral mediator is assigned within about three weeks, and many disputes settle at the conference. If you reach a settlement, you even have three business days to change your mind.',
				access: [
					'Call the DFS consumer helpline at 1-877-693-5236 (1-877-MY-FL-CFO) and ask for property insurance mediation.',
					'Or request it online through the Department of Financial Services.',
				],
				contact: [
					{
						label: 'myfloridacfo.com — Mediation',
						href: 'https://www.myfloridacfo.com/division/consumers/mediation',
					},
					{ label: '1-877-693-5236' },
				],
				status: OPEN,
			},
			{
				name: 'DFS Consumer Helpline',
				summary:
					'The general front door for any insurance problem: coverage questions, complaints about slow adjusters, or help understanding the Homeowner Claims Bill of Rights. A state insurance specialist opens a file, and your carrier must respond to the state.',
				access: [
					'Call 1-877-693-5236, Monday through Friday, or file a complaint online at myfloridacfo.com.',
				],
				contact: [
					{ label: 'myfloridacfo.com', href: 'https://www.myfloridacfo.com/division/consumers' },
					{ label: '1-877-693-5236' },
				],
				status: OPEN,
			},
		],
	},
	{
		id: 'repair-money',
		eyebrow: 'Statewide · Repair & recover',
		title: 'Repair money for families who need it',
		description:
			'From county programs to federal disaster aid, there is a ladder of help for property owners facing repairs they cannot afford on their own. County-by-county SHIP details are in the regional sections below.',
		programs: [
			{
				name: 'County SHIP Programs',
				summary:
					'Every Florida county runs a State Housing Initiatives Partnership office offering owner-occupied repair and rehabilitation help — roofs, HVAC, electrical, accessibility — for income-qualified residents. Funding windows open and close fast, and each county runs its own rules. See the Treasure Coast, Space Coast, and Orlando sections below for every local office, phone number, and current status.',
				access: [
					'Jump to your county below — each listing includes the office, phone, and whether applications are open right now.',
				],
				contact: [
					{ label: 'Treasure Coast SHIP offices', href: '#treasure-coast' },
					{ label: 'Space Coast', href: '#space-coast' },
					{ label: 'Orlando area', href: '#orlando-area' },
				],
				status: { label: 'Varies by county', tone: 'check' },
			},
			{
				name: 'USDA Section 504 Home Repair',
				summary:
					'For homes in USDA-eligible rural areas — which includes much of our service area outside the coastal cities — the USDA offers repair loans of up to $40,000 at 1% interest over 20 years, and grants of up to $10,000 for property owners 62 and older who cannot repay a loan (up to $15,000 in presidentially declared disaster areas).',
				access: [
					'Visit rd.usda.gov and search “single family housing repair,” or contact the USDA Rural Development office serving Florida. Applications are accepted year-round.',
				],
				contact: [
					{
						label: 'rd.usda.gov',
						href: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants',
					},
				],
				status: OPEN,
			},
			{
				name: 'FEMA & SBA (after a declared disaster)',
				summary:
					'When a hurricane brings a federal disaster declaration, two doors open fast: FEMA grants for uninsured essential repairs, and SBA low-interest disaster loans for property owners. Many FEMA grants require an SBA application first — so the right move is to apply to both immediately.',
				access: [
					'Apply at disasterassistance.gov or call 1-800-621-3362 — typically within 60 days of the declaration.',
					'Apply for an SBA disaster loan at sba.gov/disaster at the same time.',
				],
				contact: [
					{ label: 'disasterassistance.gov', href: 'https://www.disasterassistance.gov' },
					{
						label: 'sba.gov/disaster',
						href: 'https://www.sba.gov/funding-programs/disaster-assistance',
					},
					{ label: '1-800-621-3362' },
				],
				status: { label: 'After declared disasters', tone: 'check' },
			},
			{
				name: 'Rebuild Florida (CDBG-DR)',
				summary:
					'The state’s long-term disaster rebuilding program repaired and replaced homes after Hurricanes Irma, Michael, and Ian — but it is no longer accepting new applications. If you applied after Hurricane Ian, you can still check your application status.',
				access: [
					'Existing applicants: call 1-800-915-6803 or check ian.rebuildflorida.gov.',
				],
				contact: [
					{ label: 'ian.rebuildflorida.gov', href: 'https://ian.rebuildflorida.gov/' },
					{ label: '1-800-915-6803' },
				],
				status: { label: 'Closed to new applicants', tone: 'closed' },
			},
		],
	},
	{
		id: 'taxes-relief',
		eyebrow: 'Statewide · Taxes & other relief',
		title: 'Property-tax relief and federal benefits most owners miss',
		description:
			'Some of the biggest help isn’t a grant — it’s money you keep. These are claimed through your county property appraiser or on your federal return, and after a storm they can add up to thousands.',
		programs: [
			{
				name: 'Homestead Exemption',
				summary:
					'Up to $50,000 off your home’s assessed value, plus the Save Our Homes cap that limits assessment increases to 3% a year. File once with your county property appraiser by March 1. Worth watching: a constitutional amendment on the November 2026 ballot would increase the homestead exemption further.',
				access: [
					'File with your county property appraiser — each county’s contact is listed in the regional sections below.',
				],
				contact: [
					{
						label: 'floridarevenue.com — Property Tax Exemptions',
						href: 'https://floridarevenue.com/property/Pages/Taxpayers_Exemptions.aspx',
					},
				],
				status: OPEN,
			},
			{
				name: 'Catastrophic-Event Tax Refund (Form DR-465)',
				summary:
					'If a hurricane, flood, tornado, or fire makes your home uninhabitable for 30 days or more, Florida law (s. 197.319) entitles you to a prorated refund of that year’s property taxes. File sworn Form DR-465 with your county property appraiser by March 1 of the following year, with utility bills, insurance records, or permits as proof.',
				access: [
					'Download Form DR-465 and file it with your county property appraiser — not the tax collector.',
					'Keep utility bills and repair permits: they prove the days your home was uninhabitable.',
				],
				contact: [
					{
						label: 'Form DR-465 (PDF)',
						href: 'https://floridarevenue.com/property/Documents/dr465.pdf',
					},
				],
				status: OPEN,
			},
			{
				name: 'Rebuild Without a Tax Increase (Calamity Rule)',
				summary:
					'If your homesteaded home is damaged by a storm or other calamity, you can rebuild it — even slightly larger — without your assessed value going up, as long as the new square footage stays within 130% of the original (or 2,000 sq ft if greater) and you start within about five years. Your property appraiser applies this when you rebuild.',
				access: [
					'Tell your county property appraiser you are rebuilding after storm damage and ask for the s. 193.155 calamity treatment.',
				],
				contact: [
					{
						label: 'Florida Statute 193.155',
						href: 'https://www.flsenate.gov/laws/statutes/2025/193.155',
					},
				],
				status: OPEN,
			},
			{
				name: 'Permanent Hurricane-Supply Tax Exemption',
				summary:
					'Florida ended its temporary disaster-preparedness sales-tax holidays and instead made key hurricane supplies permanently tax-free as of August 2025 — batteries, certain portable generators, smoke and carbon-monoxide detectors, and more, every day of the year.',
				contact: [
					{
						label: 'floridarevenue.com — current exempt items',
						href: 'https://floridarevenue.com/pages/default.aspx',
					},
				],
				status: OPEN,
			},
			{
				name: 'VA Disability Housing Grants (SAH / SHA)',
				summary:
					'Veterans with qualifying service-connected disabilities can receive substantial federal grants to buy, build, or modify a home — Specially Adapted Housing grants run up to about $126,000 and Special Home Adaptation grants up to about $25,000 for fiscal year 2026, usable up to six times over a lifetime.',
				access: ['Apply online at VA.gov under housing assistance, or through your VSO.'],
				contact: [
					{
						label: 'va.gov — Disability Housing Grants',
						href: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
					},
				],
				status: OPEN,
			},
			{
				name: 'IRS Casualty-Loss Deduction',
				summary:
					'After a federally declared disaster, uninsured losses to your home can be deductible on your federal return (Form 4684) — and you can elect to claim them on the prior year’s return for a faster refund. One conversation with your tax preparer can be worth thousands.',
				contact: [
					{ label: 'irs.gov — Topic 515', href: 'https://www.irs.gov/taxtopics/tc515' },
				],
				status: OPEN,
			},
		],
	},
]

const regions: Region[] = [
	{
		id: 'treasure-coast',
		eyebrow: 'Regional guide · Treasure Coast',
		title: 'Indian River, St. Lucie & Martin counties',
		description:
			'Our home turf. Region-wide: Centro Campesino runs free weatherization for all three counties at (305) 245-7738; the nonprofit SELF fund in Fort Pierce lends for roofs, impact windows, and storm hardening at (772) 468-1818; Florida Rural Legal Services offers free housing and disaster legal help at 1-888-582-3410; and FPL pays instant rebates on A/C upgrades and ceiling insulation.',
		groups: [
			{
				id: 'indian-river',
				name: 'Indian River County',
				programs: [
					{
						name: 'Indian River County SHIP',
						summary:
							'Owner-occupied rehabilitation loans (standard and emergency), purchase assistance, and foreclosure-prevention help through County Community Services. The 2026–27 application window opened August 1, 2026 and runs until funds are gone — appointments only, no walk-ins.',
						contact: [
							{
								label: 'indianriver.gov — SHIP',
								href: 'https://indianriver.gov/services/community_services/state_housing_initiative_partnership_program/index.php',
							},
							{ label: '(772) 226-1870' },
						],
						status: OPEN,
					},
					{
						name: 'Indian River Habitat for Humanity — Home Repair',
						summary:
							'Repairs for roughly 80 working families, seniors, and veterans a year. Apply through the main office on US-1 in Vero Beach.',
						contact: [
							{ label: 'irchabitat.org', href: 'https://www.irchabitat.org/our-programs/' },
							{ label: '(772) 562-9860' },
						],
						status: OPEN,
					},
					{
						name: 'Utility-bill help (LIHEAP)',
						summary:
							'The Economic Opportunities Council of Indian River County handles energy-bill assistance from its Vero Beach office.',
						contact: [
							{ label: 'eocofirc.net', href: 'https://eocofirc.net/liheap/' },
							{ label: '(772) 562-4177' },
						],
						status: CHECK,
					},
					{
						name: 'Property Appraiser (homestead & storm-damage tax relief)',
						summary:
							'File homestead exemptions, DR-465 storm refunds, and calamity-rebuild treatment here.',
						contact: [
							{ label: 'ircpa.org', href: 'https://www.ircpa.org/' },
							{ label: '(772) 226-1469' },
						],
						status: OPEN,
					},
				],
			},
			{
				id: 'st-lucie',
				name: 'St. Lucie County',
				note: 'Three separate doors here — the county, Port St. Lucie, and Fort Pierce each run their own program. Fort Pierce is the one to watch right now.',
				programs: [
					{
						name: 'City of Fort Pierce — SHIP Rehabilitation & Purchase Assistance',
						summary:
							'City-limits residents: applications open October 1, 2026 at 8 a.m., and a mandatory orientation in September comes first (rehab sessions Sept 8 or 22; purchase sessions Sept 3 or 17). First submitted, first qualified — go to orientation and be ready on day one.',
						contact: [
							{
								label: 'cityoffortpierce.com — Grants Administration',
								href: 'https://www.cityoffortpierce.com/170/Grants-Administration',
							},
							{ label: '(772) 467-3161' },
						],
						status: { label: 'Opens Oct 1, 2026', tone: 'soon' },
					},
					{
						name: 'St. Lucie County Housing Rehabilitation (SHIP)',
						summary:
							'Roof, HVAC, and septic repair or replacement for owner-occupied homes with failing systems. The 2026 window filled its 20-application cap in May — check back for the next opening.',
						contact: [
							{
								label: 'stlucieco.gov — Housing Rehabilitation',
								href: 'https://www.stlucieco.gov/departments-and-services/community-services/housing/housing-rehabilitation-assistance',
							},
							{ label: '(772) 462-1777' },
						],
						status: CLOSED,
					},
					{
						name: 'Port St. Lucie — Homeowner Repair & Rehabilitation',
						summary:
							'Code, safety, hurricane-shutter, and accessibility repairs for city residents. Demand is intense: the 2026 pre-application list filled 100 slots in ten minutes the morning it opened in February. Mark your calendar for early 2027 and apply the minute it opens.',
						contact: [
							{
								label: 'cityofpsl.com — Housing Programs',
								href: 'https://www.cityofpsl.com/Government/Your-City-Government/Departments/Neighborhood-Services/Community-Programs/Housing-Programs/Homeowner-Repair-Rehabilitation-Assistance-Program',
							},
							{ label: '(772) 344-4084' },
						],
						status: CLOSED,
					},
					{
						name: 'SELF — Solar and Energy Loan Fund',
						summary:
							'A Fort Pierce-based nonprofit lender for roof repair, impact windows and doors, shutters, A/C, and solar — built for property owners banks turn down. A strong option when grant windows are closed.',
						contact: [
							{ label: 'solarenergyloanfund.org', href: 'https://www.solarenergyloanfund.org' },
							{ label: '(772) 468-1818' },
						],
						status: OPEN,
					},
					{
						name: 'St. Lucie Habitat — Repair A Home',
						summary:
							'Critical repairs through affordable repayable loans. Not accepting new repair applications at the moment — call to ask about the next intake.',
						contact: [
							{ label: 'stluciehabitat.org', href: 'https://stluciehabitat.org/repair-a-home/' },
							{ label: '(772) 464-1117' },
						],
						status: PAUSED,
					},
					{
						name: 'Property Appraiser (homestead & storm-damage tax relief)',
						summary: 'Offices in Fort Pierce and Port St. Lucie.',
						contact: [
							{ label: 'paslc.gov', href: 'https://www.paslc.gov/' },
							{ label: '(772) 462-1000' },
						],
						status: OPEN,
					},
				],
			},
			{
				id: 'martin',
				name: 'Martin County',
				programs: [
					{
						name: 'Martin County SHIP & CDBG Housing Rehabilitation',
						summary:
							'Roof, HVAC, and septic repairs plus code, safety, and hurricane-hardening work for income-qualified owners. Both programs are between funding windows right now — get on the county’s radar so you hear when applications reopen.',
						contact: [
							{ label: 'martin.fl.us/SHIP', href: 'https://www.martin.fl.us/SHIP' },
							{ label: '(772) 288-5785' },
						],
						status: CLOSED,
					},
					{
						name: 'Habitat for Humanity of Martin County',
						summary:
							'Runs neighborhood revitalization and the A Brush with Kindness exterior repair program with the City of Stuart. Call for current repair-program availability.',
						contact: [
							{ label: 'habitatmartin.org', href: 'https://www.habitatmartin.org/' },
							{ label: '(772) 223-9940' },
						],
						status: CHECK,
					},
					{
						name: 'Property Appraiser (homestead & storm-damage tax relief)',
						summary: 'On Willoughby Blvd. in Stuart.',
						contact: [
							{ label: 'pamartinfl.gov', href: 'https://www.pamartinfl.gov/' },
							{ label: '(772) 288-5608' },
						],
						status: OPEN,
					},
				],
			},
		],
	},
	{
		id: 'space-coast',
		eyebrow: 'Regional guide · Space Coast',
		title: 'Brevard County',
		description:
			'Brevard splits property-owner help by city: Palm Bay, Melbourne, Cocoa, and Titusville each run their own programs, and everyone else — including Rockledge and unincorporated Brevard — uses the county. Region-wide: Brevard County Legal Aid offers free civil legal help at (321) 631-2500, and the county’s own Housing & Human Services runs both weatherization, at (321) 633-2076, and utility-bill assistance, at (321) 633-1951.',
		groups: [
			{
				id: 'brevard',
				name: 'County & city programs',
				programs: [
					{
						name: 'Brevard County Repair, Rehabilitation & Reconstruction (SHIP)',
						summary:
							'Roof repair, window replacement, plumbing, electrical, insulation, and accessibility work for owner-occupied homes in unincorporated Brevard and non-participating cities like Rockledge. Currently open and accepting applications through the county’s online portal.',
						contact: [
							{
								label: 'brevardfl.gov — Housing Programs',
								href: 'https://www.brevardfl.gov/HousingAndHumanServices/HousingPrograms/ReplaceRehabAndRepairProgram',
							},
							{ label: '(321) 633-2007' },
						],
						status: OPEN,
					},
					{
						name: 'City of Melbourne — Homeowner Rehabilitation',
						summary:
							'Deferred-loan rehabilitation up to $95,000 to bring homes to code, and reconstruction assistance up to $107,000. Pre-applications are being accepted through the city’s online portal.',
						contact: [
							{
								label: 'melbourneflorida.org — Housing Programs',
								href: 'https://www.melbourneflorida.org/Government/Departments/Community-Development/Housing-Urban-Improvement/Housing-Programs',
							},
							{ label: '(321) 608-7530' },
						],
						status: OPEN,
					},
					{
						name: 'City of Titusville — Rehabilitation Assistance',
						summary:
							'Owner-occupied housing repair through the Neighborhood Services housing division — first qualified, first served, and taking applications until funds are committed.',
						contact: [
							{
								label: 'titusville.com — Rehabilitation Assistance',
								href: 'https://titusville.com/415/Rehabilitation-Assistance-Program',
							},
							{ label: '(321) 567-3997' },
						],
						status: OPEN,
					},
					{
						name: 'City of Palm Bay — Housing Rehabilitation',
						summary:
							'Rehabilitation up to $75,000 as a forgivable deferred loan, plus emergency repair and disaster assistance — but the SHIP waitlist is closed. Watch the city’s news page for short reopening windows.',
						contact: [
							{
								label: 'palmbayfl.gov — Housing Programs',
								href: 'https://www.palmbayfl.gov/government/city-departments-f-to-z/housing-programs/programs',
							},
							{ label: '(321) 726-5633' },
						],
						status: CLOSED,
					},
					{
						name: 'City of Cocoa — Housing Rehabilitation',
						summary:
							'Repair, rehabilitation, and reconstruction up to $75,000 as a deferred loan. Currently closed to new applications.',
						contact: [
							{
								label: 'cocoafl.gov — Housing Rehabilitation',
								href: 'https://www.cocoafl.gov/294/Housing-Rehabilitation-Program',
							},
							{ label: '(321) 433-8525' },
						],
						status: CLOSED,
					},
					{
						name: 'Space Coast Habitat for Humanity — Home Repairs',
						summary:
							'Critical home repair for veterans and a preservation program for owner-occupants at 30–80% of area median income. New repair applications are paused — check back or call.',
						contact: [
							{
								label: 'spacecoasthabitat.org',
								href: 'https://www.spacecoasthabitat.org/programs/home-repairs/',
							},
							{ label: '(321) 728-4009' },
						],
						status: PAUSED,
					},
					{
						name: 'Property Appraiser (homestead & storm-damage tax relief)',
						summary:
							'Offices in Titusville, Viera, Melbourne, and Palm Bay; the site takes storm-damage value-review requests directly.',
						contact: [
							{ label: 'bcpao.us', href: 'https://www.bcpao.us/' },
							{ label: '(321) 264-6700' },
						],
						status: OPEN,
					},
				],
			},
		],
	},
	{
		id: 'orlando-area',
		eyebrow: 'Regional guide · Orlando area',
		title: 'Orange, Osceola, Seminole & Lake counties',
		description:
			'The metro’s most generous programs are in Orange County and the City of Orlando right now, while Osceola and Seminole are between funding windows. Region-wide: Community Legal Services offers free housing legal help across Central Florida at (800) 405-1417; OUC’s Efficiency Delivered pays up to 85% of energy upgrades for income-qualified Orlando utility customers; and Duke Energy runs free Neighborhood Energy Saver makeovers in income-qualified neighborhoods.',
		groups: [
			{
				id: 'orange',
				name: 'Orange County & City of Orlando',
				programs: [
					{
						name: 'Orange County Housing Rehabilitation (SHIP)',
						summary:
							'Repairs that eliminate health, safety, and code hazards for very-low-income property owners who have owned and occupied the home at least a year. Applications are open through the county’s online portal.',
						contact: [
							{
								label: 'orangecountyfl.net — Housing Rehabilitation',
								href: 'https://www.orangecountyfl.net/NeighborsHousing/HousingRehabilitation.aspx',
							},
							{ label: '(407) 836-5150' },
						],
						status: OPEN,
					},
					{
						name: 'Habitat Orlando & Osceola — Home Preservation & Roof Replacement',
						summary:
							'Major repairs and full roof replacements at no cost to qualified Orange County property owners, in partnership with county government — more than 100 roofs replaced since 2019.',
						contact: [
							{ label: 'habitatorlando.org', href: 'https://habitatorlando.org/' },
							{ label: '(407) 648-4567' },
						],
						status: OPEN,
					},
					{
						name: 'City of Orlando — Housing Rehabilitation & Repair',
						summary:
							'City residents get one of the strongest programs in the state: health-and-safety repairs up to $20,000 as an outright grant with no lien, larger rehabilitation as deferred loans up to $100,000, and emergency roof, window, and plumbing repairs. Applications open online.',
						contact: [
							{
								label: 'orlando.gov — Housing Rehabilitation',
								href: 'https://www.orlando.gov/Building-Development/Housing-and-Development-Grants-Incentives-and-Assistance/Housing-Assistance-Programs/Apply-to-the-Housing-Rehabilitation-Program',
							},
							{ label: '(407) 246-2708' },
						],
						status: OPEN,
					},
					{
						name: 'Utility-bill help (LIHEAP) — Orange County Community Action',
						summary:
							'Energy-bill and crisis assistance up to $1,000 a year for income-qualified households.',
						contact: [
							{
								label: 'orangecountyfl.net — Energy Bill Assistance',
								href: 'https://www.orangecountyfl.net/CommunityFamilyServices/EnergyBillAssistance.aspx',
							},
							{ label: '(407) 836-7429' },
						],
						status: OPEN,
					},
				],
			},
			{
				id: 'osceola',
				name: 'Osceola County',
				programs: [
					{
						name: 'Osceola County SHIP',
						summary:
							'Purchase assistance, owner-occupied rehabilitation, and foreclosure prevention are all closed due to funding availability — but the emergency repair program remains available for unincorporated Osceola and St. Cloud. Monitor the county site for reopening.',
						contact: [
							{
								label: 'osceola.org — SHIP',
								href: 'https://www.osceola.org/Services/Housing-Programs/SHIP',
							},
							{ label: '(407) 742-8400' },
						],
						status: { label: 'Emergency repairs only', tone: 'check' },
					},
					{
						name: 'Osceola Council on Aging — Weatherization & LIHEAP',
						summary:
							'Free weatherization (insulation, duct and HVAC repair, air sealing) for both Osceola and Orange counties, plus energy-bill assistance for Osceola residents.',
						contact: [
							{ label: 'osceolagenerations.org', href: 'https://osceolagenerations.org/' },
							{ label: '(407) 846-8532' },
						],
						status: OPEN,
					},
				],
			},
			{
				id: 'seminole',
				name: 'Seminole County',
				programs: [
					{
						name: 'Seminole County SHIP (Minor Repair & Rehabilitation)',
						summary:
							'Minor home repair and full rehabilitation programs exist but are currently closed, and the purchase-assistance waitlist is closed with no reopening date. Check the county page for the next window.',
						contact: [
							{
								label: 'seminolecountyfl.gov — Community Development',
								href: 'https://www.seminolecountyfl.gov/departments-services/community-services/community-development/community-development-programs',
							},
							{ label: '(407) 665-2300' },
						],
						status: CLOSED,
					},
					{
						name: 'Utility-bill help (LIHEAP) — City of Sanford',
						summary:
							'Sanford administers energy-bill assistance for all Seminole County residents, by appointment.',
						contact: [
							{ label: 'sanfordfl.gov — LIHEAP', href: 'https://sanfordfl.gov/government/community-relations/liheap/' },
							{ label: '(407) 688-5166' },
						],
						status: OPEN,
					},
					{
						name: 'Meals on Wheels, Etc. — Weatherization',
						summary:
							'The weatherization provider for Seminole County — window sealing, weather stripping, ventilation, and efficiency upgrades for income-qualified homes.',
						contact: [
							{ label: 'mealsetc.org', href: 'https://www.mealsetc.org/' },
						],
						status: CHECK,
					},
				],
			},
			{
				id: 'lake',
				name: 'Lake County',
				programs: [
					{
						name: 'Lake County SHIP',
						summary:
							'Owner-occupied rehabilitation, demolition and replacement, and disaster mitigation with about $3 million in 2025–26 funding — first come, first qualified. Call to confirm the current intake before you count on it.',
						contact: [
							{
								label: 'lakecountyfl.gov — Housing',
								href: 'https://lakecountyfl.gov/housing/rehabilitation-and-replacement-programs',
							},
							{ label: '(352) 742-6519' },
						],
						status: CHECK,
					},
					{
						name: 'Habitat for Humanity Lake-Sumter — Preservation & Repair',
						summary:
							'Roof, window, and door repair or replacement, weatherization, electrical, plumbing, HVAC, and accessibility ramps for owner-occupants — open first come, first qualified, with a separate higher-income-limit repair program for City of Eustis residents.',
						contact: [
							{ label: 'habitatls.org', href: 'https://habitatls.org/eustis-home-repair/' },
							{ label: '(352) 483-0434' },
						],
						status: OPEN,
					},
					{
						name: 'Lake Community Action Agency — Weatherization & LIHEAP',
						summary:
							'Energy-bill assistance and weatherization from the Eustis office, first come, first served while funds last.',
						contact: [
							{ label: 'lakecaa.org', href: 'http://lakecaa.org' },
							{ label: '(352) 357-5550' },
						],
						status: OPEN,
					},
				],
			},
		],
	},
]


type Area = {
	id: string
	label: string
	detail: string
	count: number
}

const areas: Area[] = [
	...buckets.map((b) => ({
		id: b.id,
		label: b.title,
		detail: b.eyebrow.replace('Statewide · ', ''),
		count: b.programs.length,
	})),
	...regions.map((r) => ({
		id: r.id,
		label: r.eyebrow.replace('Regional guide · ', ''),
		detail: r.title,
		count: r.groups.reduce((n, g) => n + g.programs.length, 0),
	})),
]

const areaDetails: Record<string, string> = {
	harden: 'MSFH grants up to $10,000, condo pilot, weatherization',
	disputes: 'Free state mediation & the DFS helpline',
	'repair-money': 'SHIP, USDA, FEMA & SBA repair money',
	'taxes-relief': 'Homestead, storm refunds, VA grants',
	'treasure-coast': 'Indian River, St. Lucie & Martin',
	'space-coast': 'All of Brevard County',
	'orlando-area': 'Orange, Osceola, Seminole & Lake',
}

const areaShortLabels: Record<string, string> = {
	harden: 'Storm-proof my property',
	disputes: 'My claim went wrong',
	'repair-money': 'I need repair money',
	'taxes-relief': 'Lower my property taxes',
	'treasure-coast': 'Treasure Coast',
	'space-coast': 'Space Coast',
	'orlando-area': 'Orlando area',
}

function StatusBadge({ status }: { status: Status }) {
	return (
		<span
			className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] ${statusStyles[status.tone]}`}
		>
			{status.label}
		</span>
	)
}

function ProgramItem({ program }: { program: Program }) {
	return (
		<li className="grid gap-6 border-t border-navy/10 pt-10 lg:grid-cols-[280px_1fr]">
			<div className="space-y-3">
				<h3 className="font-display text-2xl leading-snug text-navy">{program.name}</h3>
				{program.status ? <StatusBadge status={program.status} /> : null}
			</div>
			<div className="space-y-4">
				<p className="max-w-2xl body-copy">{program.summary}</p>
				{program.access ? (
					<div>
						<p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy/60">
							How to access it
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5 body-copy">
							{program.access.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ul>
					</div>
				) : null}
				<p className="body-copy">
					{program.contact.map((c, i) => (
						<span key={c.label}>
							{i > 0 ? ' · ' : ''}
							{c.href ? (
								<a
									href={c.href}
									target={c.href.startsWith('#') ? undefined : '_blank'}
									rel={c.href.startsWith('#') ? undefined : 'noopener noreferrer'}
									className="font-semibold text-navy underline decoration-sand decoration-2 underline-offset-4 hover:text-sand"
								>
									{c.label}
								</a>
							) : (
								<span className="font-semibold text-navy">{c.label}</span>
							)}
						</span>
					))}
				</p>
			</div>
		</li>
	)
}

export function ProgramsExplorer() {
	const [selected, setSelected] = useState<string | null>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	const pick = (id: string) => {
		const next = selected === id ? null : id
		setSelected(next)
		if (next) {
			requestAnimationFrame(() => {
				contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
			})
		}
	}

	return (
		<>
			<section id="index" className="scroll-mt-24 py-16 sm:py-20">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow="Start here"
						title="What does your property need?"
						description="Tap the square that sounds like your situation. It opens the full list of programs behind it — what each one pays, who qualifies, and the exact link or phone number to apply. Statuses verified August 2026; funding windows open and close quickly, so always call before you count on a program."
					/>
					<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{areas.map((area) => {
							const active = selected === area.id
							return (
								<li key={area.id}>
									<button
										type="button"
										onClick={() => pick(area.id)}
										aria-expanded={active}
										className={`flex aspect-square w-full flex-col justify-between rounded-2xl border p-5 text-left transition-colors sm:p-6 ${
											active
												? 'border-navy bg-navy text-white'
												: 'border-navy/10 bg-white text-navy hover:border-sand'
										}`}
									>
										<span
											className={`font-sans text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? 'text-sand' : 'text-navy/50'}`}
										>
											{area.count} programs
										</span>
										<span>
											<span className="block font-display text-xl leading-tight sm:text-2xl">
												{areaShortLabels[area.id]}
											</span>
											<span
												className={`mt-2 block font-sans text-xs sm:text-sm ${active ? 'text-white/70' : 'text-stone-muted'}`}
											>
												{areaDetails[area.id] ?? area.detail}
											</span>
										</span>
										<span
											className={`font-sans text-xs font-semibold uppercase tracking-[0.16em] ${active ? 'text-sand' : 'text-navy/60'}`}
										>
											{active ? 'Open below — tap to close' : 'Tap to see the programs →'}
										</span>
									</button>
								</li>
							)
						})}
					</ul>
					{selected === null ? (
						<p className="body-copy text-stone-muted">
							Nothing is open yet — tap a square above and the full list of
							programs appears right here.
						</p>
					) : null}
				</div>
			</section>

			<div ref={contentRef} className="scroll-mt-24">
				{buckets.map((bucket) => (
					<section
						key={bucket.id}
						id={bucket.id}
						hidden={selected !== bucket.id}
						className="scroll-mt-24 pb-20 pt-4 sm:pb-24"
					>
						<div className="section-shell space-y-12">
							<SectionHeading
								eyebrow={bucket.eyebrow}
								title={bucket.title}
								description={bucket.description}
							/>
							<ul className="space-y-12">
								{bucket.programs.map((program) => (
									<ProgramItem key={program.name} program={program} />
								))}
							</ul>
						</div>
					</section>
				))}

				{regions.map((region) => (
					<section
						key={region.id}
						id={region.id}
						hidden={selected !== region.id}
						className="scroll-mt-24 pb-20 pt-4 sm:pb-24"
					>
						<div className="section-shell space-y-14">
							<SectionHeading
								eyebrow={region.eyebrow}
								title={region.title}
								description={region.description}
							/>
							{region.groups.map((group) => (
								<div key={group.id} id={group.id} className="scroll-mt-24 space-y-8">
									<div className="max-w-2xl">
										<h3 className="font-display text-3xl text-navy">{group.name}</h3>
										{group.note ? (
											<p className="mt-3 body-copy text-stone-muted">{group.note}</p>
										) : null}
									</div>
									<ul className="space-y-12">
										{group.programs.map((program) => (
											<ProgramItem key={program.name} program={program} />
										))}
									</ul>
								</div>
							))}
						</div>
					</section>
				))}
			</div>
		</>
	)
}
