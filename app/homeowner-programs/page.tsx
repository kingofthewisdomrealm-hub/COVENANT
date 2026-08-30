import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'

import { EligibilityCheck } from './eligibility-check'
import { MoneyMap } from './money-map'
import { ProgramsExplorer } from './programs-explorer'

export const metadata: Metadata = {
	title:
		'Government Assistance for Florida Property Owners | Treasure Coast, Space Coast & Orlando Resource Guide',
	description:
		'The complete guide to government assistance for Florida property owners: My Safe Florida Home grants, free DFS claim mediation, property-tax relief, and county-by-county repair programs for the Treasure Coast, Space Coast, and Orlando area — every link, phone number, and current status.',
	alternates: { canonical: '/homeowner-programs' },
}

export default function HomeownerProgramsPage() {
	return (
		<>
			<Hero
				compact
				headline="Florida has money set aside for property owners. Most never claim it."
				support="Storm-proofing grants, free help with insurance disputes, repair money, property-tax refunds — the state funds all of it, but the programs are scattered across dozens of websites. We put every one in one place. Pick your situation below and you'll see exactly what each program pays, who qualifies, and the exact link or phone number to apply. Applying is free, and we never charge for pointing the way."
				primaryCta={{ href: '/contact', label: 'Ask us about a program' }}
			/>
			<TrustBand />

			<ProgramsExplorer />

			<section className="py-20 sm:py-24">
				<div className="section-shell grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
					<SectionHeading
						eyebrow="Skip the homework"
						title="Want us to check for you? It takes 60 seconds."
						description="Dozens of program websites, each with its own rules — or four quick questions here. Tell us what your property needs and we'll tell you which programs likely fit, check their current funding status, and do the paperwork with you. Free either way."
					/>
					<EligibilityCheck />
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-16">
					<SectionHeading
						eyebrow="The Florida money map"
						title="Three doors. Every card below is a link."
						description="Harden your property before the storm, get free state help when a claim goes sideways, and find repair money when you need it. Tap any card and it takes you straight to the official application site or phone line — you apply directly, the help is free, and we never charge for pointing the way."
					/>
					<MoneyMap />
				</div>
			</section>

			<section className="py-20 sm:py-24">
				<div className="section-shell space-y-6">
					<SectionHeading
						eyebrow="How we fit in"
						title="Your builder for the funded work"
						description="When a grant or program funds hardening or repairs, you still choose your own licensed contractor. Covenant Builders provides the quotes, wind-mitigation documentation, and licensed work that programs like My Safe Florida Home require — and we are happy to walk you through which programs fit your situation before you spend a dollar."
					/>
					<p className="body-copy max-w-3xl">
						Program details, funding, and deadlines change with each legislative
						session — statuses on this page were verified in August 2026. Always
						confirm current terms on the official program sites linked above.
						Covenant Builders is not affiliated with these programs; applications
						are made directly by the property owner or association.
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
