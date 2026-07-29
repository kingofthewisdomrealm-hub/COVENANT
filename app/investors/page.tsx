import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { TrustBand } from '@/components/trust-band'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
	title: 'Investors — Angel & Growth Capital Conversations',
	description:
		'Covenant Builders investor overview: Florida Certified Building Contractor CBC1253676, Treasure Coast growth opportunity, and contact for accredited investors.',
	alternates: { canonical: '/investors' },
	robots: {
		index: false,
		follow: false,
	},
}

const highlights = [
	{
		title: 'Licensed longevity',
		body: 'Florida CBC1253676 — Certified Building Contractor, active since 2005. Credentials investors can verify on DBPR.',
	},
	{
		title: 'Regional demand',
		body: 'Treasure Coast construction and commercial activity continue as households and businesses migrate north from South Florida.',
	},
	{
		title: 'Craft + full service',
		body: 'Homes, kitchens and cabinetry, commercial work, and remodels—coordinated from planning through finish.',
	},
	{
		title: 'Local operating base',
		body: 'Vero Beach headquarters, bilingual team, and a founder-led culture built on communication and delivery.',
	},
]

const diligenceReady = [
	'Florida contractor license and qualifying documentation',
	'Insurance and bonding capacity materials',
	'Corporate / DBA records (Interior Specialties Inc → Covenant Builders)',
	'Project photography and operating overview',
	'Confidential financials and ask details under NDA',
]

export default function InvestorsPage() {
	return (
		<>
			<Hero
				compact
				headline="Built for clients. Ready for partners."
				support="Covenant Builders is opening conversations with angels and early growth investors who want exposure to a licensed Treasure Coast contractor with twenty years of credentialed operating history."
				primaryCta={{
					href: `mailto:${siteConfig.emails.josias}?subject=Investor%20inquiry%20—%20Covenant%20Builders`,
					label: 'Request investor materials',
				}}
				secondaryCta={{
					href: siteConfig.phones.sr.href,
					label: `Call ${siteConfig.phones.sr.display}`,
				}}
			/>

			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="space-y-5">
						<p className="eyebrow">Investment thesis</p>
						<h2 className="display-title">
							A verifiable builder in a selective growth market
						</h2>
						<p className="body-copy">
							As Treasure Coast housing and commercial markets normalize after
							years of rapid expansion, clients and developers underwrite
							execution risk more carefully. Covenant Builders brings a rare
							combination for a regional GC: continuous Florida license tenure
							since 2005, craft roots in cabinetry, bilingual service, and a
							full-service offering across residential and commercial work.
						</p>
						<p className="body-copy">
							Growth capital is intended to expand bonding capacity, working
							capital, crew depth, systems, and controlled geographic coverage—
							without diluting the delivery standard the brand is built on.
						</p>
					</div>

					<div className="border border-navy/10 bg-white/75 p-8">
						<p className="eyebrow">For accredited investors</p>
						<ul className="mt-6 space-y-4">
							{diligenceReady.map((item) => (
								<li
									key={item}
									className="font-sans text-sm leading-relaxed text-ink/85 before:mr-2 before:text-sand before:content-['—']"
								>
									{item}
								</li>
							))}
						</ul>
						<p className="mt-8 font-sans text-xs leading-relaxed text-stone-muted">
							Financial ask, cap table, and detailed results are shared privately
							after an introductory conversation—not published on this site.
						</p>
					</div>
				</div>
			</section>

			<section className="bg-navy py-20 text-white sm:py-28">
				<div className="section-shell space-y-12">
					<div className="max-w-2xl space-y-4">
						<p className="eyebrow !text-sand">Why Covenant</p>
						<h2 className="display-title text-white">
							What serious capital looks for—and what we bring
						</h2>
					</div>
					<ul className="grid gap-8 sm:grid-cols-2">
						{highlights.map((item) => (
							<li key={item.title} className="border-t border-white/15 pt-6">
								<h3 className="font-display text-2xl text-white">{item.title}</h3>
								<p className="mt-3 font-sans text-base leading-relaxed text-white/75">
									{item.body}
								</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell grid gap-10 lg:grid-cols-2">
					<div className="space-y-4">
						<p className="eyebrow">Leadership</p>
						<h2 className="display-title">Josias Andujar</h2>
						<p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-sand-dark">
							President & Founder · CBC1253676
						</p>
						<p className="body-copy">
							Cabinetmaker by training. Florida Certified Building Contractor by
							credential. Treasure Coast operator since 2004. Capital partners
							work directly with ownership—not a distant corporate layer.
						</p>
						<Link href="/about" className="link-underline">
							Read the full story
						</Link>
					</div>

					<div className="space-y-4 border border-navy/10 bg-white/75 p-8">
						<p className="eyebrow">Next step</p>
						<h2 className="font-display text-3xl text-navy">
							Request an introduction package
						</h2>
						<p className="body-copy">
							Tell us who you are, typical check size, and what you want to see
							first. We will send the one-pager and schedule a call.
						</p>
						<div className="flex flex-wrap gap-4 pt-2">
							<a
								href={`mailto:${siteConfig.emails.josias}?subject=Investor%20inquiry%20—%20Covenant%20Builders`}
								className="btn-primary"
							>
								Email {siteConfig.emails.josias}
							</a>
							<a href={siteConfig.phones.sr.href} className="link-underline">
								{siteConfig.phones.sr.display}
							</a>
						</div>
						<p className="pt-4 font-sans text-xs leading-relaxed text-stone-muted">
							This page is not an offer to sell securities. Discussions are limited
							to qualified / accredited investors and are subject to diligence and
							definitive documents.
						</p>
					</div>
				</div>
			</section>
		</>
	)
}
