import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { ProjectGallery } from '@/components/project-gallery'
import { SectionHeading } from '@/components/section-heading'

export const metadata: Metadata = {
	title: 'Portfolio — Treasure Coast Projects',
	description:
		'Selected residential, commercial, and remodel photography from Covenant Builders in Vero Beach and the Treasure Coast.',
	alternates: { canonical: '/portfolio' },
}

export default function PortfolioPage() {
	return (
		<>
			<Hero
				compact
				headline="Work that shows how we build"
				support="Browse available project photography by category. We are documenting fuller case studies—names, scope, and outcomes—without inventing what we cannot verify yet."
				primaryCta={{ href: '/contact', label: 'Discuss your project' }}
				imageSrc="/images/intro.webp"
				imageAlt="Covenant Builders project collaboration on site"
			/>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow="Gallery"
						title="Selected project photography"
						description="Filters only show categories that exist in this scaffold. More projects are coming."
					/>
					<ProjectGallery />
					<div className="border-t border-navy/10 pt-10">
						<p className="body-copy max-w-2xl">
							Have a project that belongs here? Request an estimate and we will
							talk through scope, timeline, and next steps.
						</p>
						<Link href="/contact" className="link-underline mt-5">
							Request an estimate
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
