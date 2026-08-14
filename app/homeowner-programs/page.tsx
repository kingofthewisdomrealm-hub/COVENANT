import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'

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
				headline="Assistance for Florida property owners"
				support="The complete guide to government help for your home — statewide grants, free claim mediation, property-tax relief, and county-by-county repair programs across the Treasure Coast, Space Coast, and Orlando area. Pick an area below to see every program, phone number, and current status."
				primaryCta={{ href: '/contact', label: 'Ask us about a program' }}
			/>
			<TrustBand />

			<ProgramsExplorer />

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
