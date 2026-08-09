import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'

export const metadata: Metadata = {
	title: 'Programs That Help Homeowners | Grants, Free Mediation & Repair Assistance in Florida',
	description:
		'Florida programs that put real money and free help in homeowners’ hands: My Safe Florida Home grants up to $10,000, free DFS claim mediation, county SHIP repair assistance, USDA rural repair loans, and post-storm FEMA and SBA aid — with links and phone numbers.',
	alternates: { canonical: '/homeowner-programs' },
}

type Program = {
	name: string
	summary: string
	access: string[]
	contact: { label: string; href?: string }[]
}

type Bucket = {
	eyebrow: string
	title: string
	description: string
	programs: Program[]
}

const buckets: Bucket[] = [
	{
		eyebrow: 'Harden your home',
		title: 'Money to strengthen your home before the storm',
		description:
			'Florida pays homeowners to make their homes stronger. These programs fund impact windows and doors, roof-to-wall strapping, and stronger roofing — and completed upgrades usually earn insurance discounts too.',
		programs: [
			{
				name: 'My Safe Florida Home (MSFH)',
				summary:
					'A free wind-mitigation inspection of your home, then a grant of up to $10,000 toward approved wind-hardening upgrades. Most homeowners get a 2-to-1 match — the state pays $2 for every $1 you spend. Low-income homeowners can qualify for up to $10,000 with no match required, and low-income seniors are first in line.',
				access: [
					'Apply free at mysafeflhome.com — it takes minutes.',
					'The state schedules your free wind-mitigation inspection and sends a report of qualifying upgrades.',
					'Once your grant is approved — and only then — choose a contractor and complete the work.',
					'Submit invoices for reimbursement. We help our clients with quotes, wind-mitigation documentation, and closeout paperwork.',
				],
				contact: [
					{ label: 'mysafeflhome.com', href: 'https://mysafeflhome.com' },
				],
			},
			{
				name: 'My Safe Florida Condo (pilot)',
				summary:
					'The condominium version of MSFH for buildings three habitable stories and up. The association applies — not individual unit owners — and grants fund wind-hardening of common elements like roofs and openings. If your board is already planning milestone or SIRS repairs, this can offset the hardening portion of the project.',
				access: [
					'Your association board applies through the same portal, mysafeflhome.com.',
					'Ask us how the pilot pairs with milestone inspection repairs — we work with condo boards across the Treasure Coast.',
				],
				contact: [
					{ label: 'mysafeflhome.com', href: 'https://mysafeflhome.com' },
				],
			},
			{
				name: 'Weatherization Assistance Program (WAP)',
				summary:
					'Free energy-related repairs — insulation, air sealing, and more — for income-qualified households, delivered through local agencies under FloridaCommerce.',
				access: [
					'Search “Florida Weatherization Assistance Program” to find your county’s provider and apply through them.',
				],
				contact: [
					{
						label: 'FloridaCommerce — Weatherization',
						href: 'https://www.floridajobs.org/community-planning-and-development/community-services/weatherization-assistance-program',
					},
				],
			},
		],
	},
	{
		eyebrow: 'When a claim goes wrong',
		title: 'Free state help with insurance disputes',
		description:
			'If your property insurance claim is stalled, underpaid, or denied, the State of Florida gives you free tools most homeowners have never heard of. You do not have to face the insurance company alone.',
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
			},
		],
	},
	{
		eyebrow: 'Repair & recover',
		title: 'Repair money for families who need it',
		description:
			'From county programs to federal disaster aid, there is a ladder of help for homeowners facing repairs they cannot afford on their own.',
		programs: [
			{
				name: 'County SHIP Programs',
				summary:
					'Every Florida county runs a State Housing Initiatives Partnership office offering owner-occupied rehabilitation help — including emergency repairs — for income-qualified residents. In Indian River County, applications are taken by appointment.',
				access: [
					'Indian River County residents: call (772) 226-1870 (appointments only).',
					'Outside Indian River County, search “[your county] SHIP program” for your local office.',
				],
				contact: [
					{
						label: 'Indian River County SHIP',
						href: 'https://indianriver.gov/services/community_services/state_housing_initiative_partnership_program/index.php',
					},
					{ label: '(772) 226-1870' },
				],
			},
			{
				name: 'USDA Section 504 Home Repair',
				summary:
					'For homes in USDA-eligible rural areas — which includes much of our service area outside the coastal cities — the USDA offers repair loans of up to about $40,000 at 1% interest, and grants of up to about $10,000 for homeowners 62 and older who cannot repay a loan.',
				access: [
					'Visit rd.usda.gov and search “single family housing repair,” or contact the USDA Rural Development office serving Florida.',
				],
				contact: [
					{ label: 'rd.usda.gov', href: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants' },
				],
			},
			{
				name: 'FEMA & SBA (after a declared disaster)',
				summary:
					'When a hurricane brings a federal disaster declaration, two doors open fast: FEMA grants for uninsured essential repairs, and SBA low-interest disaster loans for homeowners. Many FEMA grants require an SBA application first — so the right move is to apply to both immediately.',
				access: [
					'Apply at disasterassistance.gov or call 1-800-621-3362 — typically within 60 days of the declaration.',
					'Apply for an SBA disaster loan at sba.gov/disaster at the same time.',
				],
				contact: [
					{ label: 'disasterassistance.gov', href: 'https://www.disasterassistance.gov' },
					{ label: 'sba.gov/disaster', href: 'https://www.sba.gov/funding-programs/disaster-assistance' },
					{ label: '1-800-621-3362' },
				],
			},
		],
	},
]

export default function HomeownerProgramsPage() {
	return (
		<>
			<Hero
				compact
				headline="Programs that help homeowners"
				support="Florida offers real money and free help to protect, repair, and defend your home — grants, free claim mediation, and repair assistance. Here is the map, with every link and phone number you need."
				primaryCta={{ href: '/contact', label: 'Ask us about a program' }}
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-16">
					<SectionHeading
						eyebrow="The money map"
						title="Three kinds of help, one picture"
						description="Harden your home before the storm, get free help when a claim goes sideways, and find repair money when you need it. We point our clients to these doors every week — the applications are yours, free, and we never charge for pointing the way."
					/>
					<Image
						src="/images/florida-money-map.png"
						alt="The Florida money map: programs that harden homes, resolve insurance disputes, and fund repairs"
						width={2100}
						height={1400}
						className="w-full rounded-2xl border border-navy/10 shadow-sm"
					/>
				</div>
			</section>

			{buckets.map((bucket) => (
				<section key={bucket.title} className="py-20 sm:py-24">
					<div className="section-shell space-y-12">
						<SectionHeading
							eyebrow={bucket.eyebrow}
							title={bucket.title}
							description={bucket.description}
						/>
						<ul className="space-y-12">
							{bucket.programs.map((program) => (
								<li
									key={program.name}
									className="grid gap-6 border-t border-navy/10 pt-10 lg:grid-cols-[280px_1fr]"
								>
									<h3 className="font-display text-2xl leading-snug text-navy">
										{program.name}
									</h3>
									<div className="space-y-4">
										<p className="max-w-2xl body-copy">{program.summary}</p>
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
										<p className="body-copy">
											{program.contact.map((c, i) => (
												<span key={c.label}>
													{i > 0 ? ' · ' : ''}
													{c.href ? (
														<a
															href={c.href}
															target="_blank"
															rel="noopener noreferrer"
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
							))}
						</ul>
					</div>
				</section>
			))}

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell space-y-6">
					<SectionHeading
						eyebrow="How we fit in"
						title="Your builder for the funded work"
						description="When a grant or program funds hardening or repairs, you still choose your own licensed contractor. Covenant Builders provides the quotes, wind-mitigation documentation, and licensed work that programs like My Safe Florida Home require — and we are happy to walk you through which programs fit your situation before you spend a dollar."
					/>
					<p className="body-copy max-w-3xl">
						Program details, funding, and deadlines change with each legislative
						session. Always confirm current terms on the official program sites
						linked above. Covenant Builders is not affiliated with these
						programs; applications are made directly by the homeowner or
						association.
					</p>
					<Link
						href="/contact"
						className="inline-block rounded-full bg-navy px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy/90"
					>
						Talk to us about your project
					</Link>
				</div>
			</section>
		</>
	)
}
