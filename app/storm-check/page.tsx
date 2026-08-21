import type { Metadata } from 'next'
import Link from 'next/link'

import { StormQuiz } from './storm-quiz'
import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { siteConfig } from '@/content/site'
import { STORM_INSURANCE_NOTICE, stormEvents } from '@/content/storm-check'

const SHARE_TITLE = 'Was your roof hit? Take the 60-second storm check.'
const SHARE_DESCRIPTION =
	'Enter your ZIP, answer six quick questions, and find out whether the hail and wind that crossed the Treasure Coast likely touched your roof. Free, written results, from a licensed Florida building contractor.'

export const metadata: Metadata = {
	title: 'Storm Check — Hail & Wind Roof Damage Quiz | Treasure Coast, FL',
	description:
		'Free 60-second hail and wind damage check for homeowners in Indian River, St. Lucie, Martin and Palm Beach counties. Enter your ZIP, answer six questions, get written results from a licensed Florida contractor.',
	alternates: { canonical: '/storm-check' },
	openGraph: {
		title: SHARE_TITLE,
		description: SHARE_DESCRIPTION,
		url: '/storm-check',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: SHARE_TITLE,
		description: SHARE_DESCRIPTION,
	},
}

/**
 * The hail & wind quiz funnel. Landing page for the storm-area domains.
 *
 * Section order: hero → the quiz immediately (people arrive from an ad
 * already wanting the answer) → what the signs are → who we are → the plan.
 * Every sentence on this page is a roof advertisement under F.S. §489.147.
 * See the compliance block in content/storm-check.ts before editing copy.
 */
export default function StormCheckPage() {
	const latest = stormEvents[0]

	return (
		<>
			<Hero
				compact
				headline="Was your roof hit? Find out in 60 seconds."
				support="Hail marks gutters and AC fins long before a roof shows it from the street. Enter your ZIP, answer six quick questions, and get a written answer from a licensed Florida building contractor. Free, no obligation."
				primaryCta={{ href: '#storm-check', label: 'Check my roof' }}
				secondaryCta={{
					href: siteConfig.phones.sr.href,
					label: `Call ${siteConfig.phones.sr.display}`,
				}}
				imageSrc="/images/portfolio/project-03.jpg"
				imageAlt="A Covenant Builders home on the Treasure Coast"
			/>

			<TrustBand />

			<section id="storm-check" className="scroll-mt-24 bg-white py-16 sm:py-20">
				<div className="section-shell">
					<div className="mx-auto max-w-3xl">
						<StormQuiz />
					</div>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Why this exists"
						title="Storm damage does not look like storm damage."
						description={`${latest.label}: ${latest.detail}`}
					/>
					<div className="mt-8 max-w-2xl space-y-5">
						<p className="body-copy">
							A hail-bruised shingle looks fine from the driveway. The granules
							are loosened, the mat underneath is cracked, and the roof leaks the
							first time it rains hard enough — sometimes a year later, when nobody
							connects it to the storm.
						</p>
						<p className="body-copy text-navy">
							<strong>
								The soft metals tell the story first. Dented gutters, dinged AC
								fins, pocked window screens. If those took hits, the roof did too.
							</strong>
						</p>
					</div>
				</div>
			</section>

			<section className="bg-white py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="What to look for"
						title="Five things you can check from the ground"
					/>
					<div className="mt-12 grid gap-6 md:grid-cols-3">
						{signs.map((item) => (
							<div key={item.title} className="border border-navy/10 bg-white p-7 reveal">
								<h3 className="font-display text-xl tracking-tight text-navy">
									{item.title}
								</h3>
								<p className="mt-3 font-sans text-base leading-relaxed text-stone-muted">
									{item.body}
								</p>
							</div>
						))}
					</div>
					<p className="mt-8 max-w-2xl border border-sand-dark/40 bg-sand/10 px-4 py-3 font-sans text-sm leading-relaxed text-navy">
						{STORM_INSURANCE_NOTICE}
					</p>
				</div>
			</section>

			<section className="bg-navy py-20 text-white sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Who is checking"
						tone="dark"
						title="A licensed building contractor, not a storm chaser."
						description="After every storm, trucks with out-of-state plates show up. Some are fine. Some are gone before the first rain. You should not have to guess which one is in your driveway."
					/>
					<div className="mt-8 max-w-2xl space-y-6">
						<p className="body-copy text-white/80">
							Covenant Builders has been building on the Treasure Coast since{' '}
							{siteConfig.license.licensedYear}. Josias Andujar Sr. holds Florida
							Certified Building Contractor license{' '}
							<strong className="text-sand-light">{siteConfig.license.number}</strong>,
							active through {siteConfig.license.expires}. We are here before the
							storm and after the trucks leave.
						</p>
						<p>
							<a
								className="btn-secondary"
								href={siteConfig.license.dbprLookupUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Verify our license
							</a>
						</p>
						<p className="font-sans text-sm leading-relaxed text-white/60">
							{siteConfig.serviceCities.join(' · ')}. {siteConfig.bilingualNote}
						</p>
					</div>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading eyebrow="How it works" title="Three steps, no surprises" />
					<ol className="mt-12 grid gap-8 md:grid-cols-3">
						{planSteps.map((item, index) => (
							<li key={item.title} className="reveal">
								<span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-lg text-sand">
									{index + 1}
								</span>
								<h3 className="mt-5 font-display text-xl tracking-tight text-navy">
									{item.title}
								</h3>
								<p className="mt-3 font-sans text-base leading-relaxed text-stone-muted">
									{item.body}
								</p>
							</li>
						))}
					</ol>
					<p className="mt-12">
						<Link href="#storm-check" className="btn-primary">
							Check my roof
						</Link>
					</p>
				</div>
			</section>
		</>
	)
}

const signs = [
	{
		title: 'Gutters and downspouts',
		body: 'Run your hand along the top edge. Hail leaves round dimples. Wind leaves bends and pulled fasteners.',
	},
	{
		title: 'The AC unit',
		body: 'The thin metal fins on the outside condenser dent from hail the size of a dime. If they are flattened on one side, that side faced the storm.',
	},
	{
		title: 'Window screens and trim',
		body: 'Pocks in screens, chipped paint on metal trim, dents in the mailbox. Cheap evidence, easy to photograph.',
	},
	{
		title: 'The downspout splash',
		body: 'A pile of black or grey grit where the downspout empties is shingle granules. That roof is shedding its armour.',
	},
	{
		title: 'Inside, after rain',
		body: 'A faint tea-coloured ring on a ceiling. A drip in the garage. Water always finds the damage before you do.',
	},
] as const

const planSteps = [
	{
		title: 'Check it.',
		body: 'Sixty seconds, right here. Your ZIP is matched to recorded storm reports, and your answers are scored the way an inspector would score a first walk-around.',
	},
	{
		title: 'Inspect it.',
		body: 'A licensed contractor gets on the roof, photographs every slope and every soft metal, and writes it up. Free. You keep the photos and the report.',
	},
	{
		title: 'Decide with it.',
		body: 'You get a written repair scope and a real number. What you do next is your call. Nobody will be parked in your driveway waiting for an answer.',
	},
] as const
