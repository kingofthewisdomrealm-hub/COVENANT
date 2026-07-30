import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { ProjectGallery } from '@/components/project-gallery'
import { SectionHeading } from '@/components/section-heading'

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
				support="Browse residential, commercial, and remodel work from jobs across Vero Beach and the Treasure Coast. More completed projects will be added as we photograph them."
				primaryCta={{ href: '/contact', label: 'Discuss your project' }}
				imageSrc="/images/intro.webp"
				imageAlt="Covenant Builders project collaboration on site"
			/>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow="Gallery"
						title="Selected project photography"
						description="Use the filters to view residential, commercial, or remodel work. We are continually adding new photos from active and completed builds."
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
