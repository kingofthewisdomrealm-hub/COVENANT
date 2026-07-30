import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { ProjectGallery } from '@/components/project-gallery'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'

export const metadata: Metadata = {
	title: 'Our Construction Projects in Vero Beach & Treasure Coast',
	description:
		'Browse residential, kitchen, commercial, and remodel projects by Covenant Builders — Florida CBC1253676 — across Vero Beach and the Treasure Coast.',
	alternates: { canonical: '/portfolio' },
}

export default function PortfolioPage() {
	return (
		<>
			<Hero
				compact
				headline="Work that shows how we build"
				support="Browse residential, commercial, and remodel photography from jobs across Vero Beach and the Treasure Coast. Fuller case studies are added as we document completed homes and remodels."
				primaryCta={{ href: '/contact', label: 'Discuss your project' }}
				secondaryCta={{ href: '/services', label: 'View services' }}
				imageSrc="/images/intro.webp"
				imageAlt="Covenant Builders project collaboration on a Treasure Coast job site"
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow="Gallery"
						title="Selected project photography"
						description="Filter by residential, commercial, or remodel. Captions describe the work shown — we do not invent testimonials or fake project outcomes."
					/>
					<ProjectGallery />
				</div>
			</section>

			<section className="bg-stone-warm py-16 sm:py-20">
				<div className="section-shell grid gap-10 lg:grid-cols-2">
					<div className="space-y-4">
						<SectionHeading
							eyebrow="How we document"
							title="Honest portfolio, growing over time"
							description="Photos come from real Treasure Coast jobs. When we publish a full project story, it includes location, scope, and what the client needed — never placeholder praise."
						/>
					</div>
					<ul className="space-y-5 font-sans text-sm leading-relaxed text-ink/80">
						<li className="border-t border-navy/10 pt-4">
							<strong className="text-navy">What you’ll see today:</strong>{' '}
							craftsmanship, progress, kitchens, and site work from active and
							recent builds.
						</li>
						<li className="border-t border-navy/10 pt-4">
							<strong className="text-navy">What’s coming:</strong> named project
							stories with city, scope, and results once photographed and
							approved.
						</li>
						<li className="border-t border-navy/10 pt-4">
							<strong className="text-navy">Want similar work?</strong>{' '}
							<Link href="/contact" className="link-underline">
								Request an estimate
							</Link>{' '}
							and we’ll walk scope, timeline, and next steps.
						</li>
					</ul>
				</div>
			</section>
		</>
	)
}
