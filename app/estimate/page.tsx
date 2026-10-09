import type { Metadata } from 'next'

import { PhotoEstimator } from './photo-estimator'
import { siteConfig } from '@/content/site'

/**
 * /estimate — "Snap a Photo. Get a Project Estimate."
 *
 * LAUNCH GATE: the page stays out of search (noindex), the sitemap, and the
 * nav until Josias approves the integration, pricebook, and wording. Flip
 * ESTIMATOR_PUBLIC below to true at launch, then add it to app/sitemap.ts
 * and navLinks.
 */
const ESTIMATOR_PUBLIC = false

const TITLE = 'Snap a Photo. Get a Project Estimate.'
const DESCRIPTION =
	'Upload a photo of the repair or renovation and get a preliminary estimate in minutes from a licensed Treasure Coast building contractor. Free, no obligation.'

export const metadata: Metadata = {
	title: 'Photo Estimate — Snap a Photo, Get a Project Estimate | Covenant Builders',
	description: DESCRIPTION,
	alternates: { canonical: '/estimate' },
	robots: ESTIMATOR_PUBLIC ? undefined : { index: false, follow: false },
	openGraph: { title: TITLE, description: DESCRIPTION, url: '/estimate', type: 'website' },
	twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function EstimatePage() {
	return (
		<div className="min-h-screen bg-white">
			<section className="mx-auto max-w-4xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-20">
				<p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-sand-dark">Photo estimate</p>
				<h1 className="mt-4 font-display text-4xl leading-[1.05] text-navy sm:text-6xl">
					Snap a Photo.
					<br />
					Get a Project Estimate.
				</h1>
				<p className="mx-auto mt-5 max-w-xl font-sans text-lg leading-relaxed text-navy/70">
					Wondering what that repair or renovation might cost? Upload a photo and get a preliminary estimate in minutes.
				</p>
				<a
					href="#estimator"
					className="mt-8 inline-flex min-h-[3.5rem] items-center justify-center rounded-full bg-navy px-8 font-sans text-base font-semibold text-white transition hover:bg-navy-soft"
				>
					Upload Your Project Photo
				</a>
				<p className="mt-5 font-sans text-sm text-navy/50">
					Licensed Florida building contractor {siteConfig.license.number} · {siteConfig.bilingualNote}
				</p>
			</section>

			<section id="estimator" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-20 sm:px-6">
				<PhotoEstimator />
			</section>

			<section className="border-t border-navy/10 bg-stone/40">
				<div className="mx-auto grid max-w-4xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
					{[
						['1. Show us', 'Take a photo or upload a few. Location data is stripped on your phone.'],
						['2. Get a range', 'We identify the work and price it from our own pricebook — Budget, Standard, Premium.'],
						['3. Talk to a person', 'A licensed builder reviews every request before any official quote.'],
					].map(([h, b]) => (
						<div key={h}>
							<h2 className="font-display text-xl text-navy">{h}</h2>
							<p className="mt-2 font-sans text-sm leading-relaxed text-navy/65">{b}</p>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
