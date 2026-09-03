import type { Metadata } from 'next'
import Link from 'next/link'

import { BuildGame } from './build-game'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { SectionHeading } from '@/components/section-heading'
import { siteConfig } from '@/content/site'

const SHARE_TITLE = 'Can you put a roof on in the right order?'
const SHARE_DESCRIPTION =
	'A two-minute game from a licensed Florida contractor. Drag the steps onto the roof — or the whole house — in the real order. Get it wrong and it leaks.'

export const metadata: Metadata = {
	title: 'Roof Raiser — the build-it-in-order game',
	description:
		'Learn how a Florida roof and a concrete-block house actually go together, one step at a time, by playing. Real inspection order, real steps, zero jargon.',
	alternates: { canonical: '/play' },
	openGraph: {
		title: SHARE_TITLE,
		description: SHARE_DESCRIPTION,
		url: '/play',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: SHARE_TITLE,
		description: SHARE_DESCRIPTION,
	},
}

/**
 * /play — the build-order game.
 *
 * Why a game: most homeowners have never seen the order a roof or a house
 * goes together in, so they cannot tell a careful contractor from a fast
 * one. Two minutes of dragging cards fixes that. Every level ends on the
 * project designer.
 */
export default function PlayPage() {
	return (
		<>
			<BreadcrumbJsonLd crumbs={[{ name: 'Roof Raiser', path: '/play' }]} />
			<section className="bg-navy pb-16 pt-32 text-white sm:pb-20 sm:pt-36">
				<div className="section-shell">
					<BuildGame />
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Why this exists"
						title="You cannot judge a contractor if you do not know the order."
						description="A roof is eight steps and five county inspections. A house is ten steps and five more. Most people only ever see the first day and the last day. Now you have seen the middle."
					/>
					<div className="mt-8 max-w-2xl space-y-5">
						<p className="body-copy">
							Every leak we get called out to started as a skipped step. The
							membrane left off because the shingles were already on the truck.
							Drywall hung before the inspector saw the wiring. A roof-over on
							wood that should have been replaced.
						</p>
						<p className="body-copy text-navy">
							<strong>
								The order is not our opinion. It is the inspection sequence the
								county requires, and we build to it on every job.
							</strong>
						</p>
					</div>
				</div>
			</section>

			<section className="bg-white py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Ready for the real thing?"
						title="Plan your project in about five minutes."
						description="Pick the type of work, answer a few questions, sketch the space if you like, and book a time to talk. No pressure, no spam — written follow-up from a licensed contractor."
					/>
					<div className="mt-8 flex flex-wrap gap-3">
						<Link href="/design-your-project" className="btn-primary">
							Design your project
						</Link>
						<a className="btn-secondary" href={siteConfig.phones.sr.href}>
							Call {siteConfig.phones.sr.display}
						</a>
					</div>
					<p className="mt-8 font-sans text-sm leading-relaxed text-stone-muted">
						Florida Certified Building Contractor {siteConfig.license.number}.{' '}
						{siteConfig.serviceCities.join(' · ')}. {siteConfig.bilingualNote}
					</p>
				</div>
			</section>
		</>
	)
}
