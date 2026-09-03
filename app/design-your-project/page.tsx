import type { Metadata } from 'next'
import Link from 'next/link'

import { ProjectDesigner } from './project-designer'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { siteConfig } from '@/content/site'

const SHARE_TITLE = 'Design your project. Get a straight answer.'
const SHARE_DESCRIPTION =
	'Answer a few questions about what you want built. In about five minutes you will have a written project brief — and a licensed Vero Beach builder ready to walk the property with you. Free, no obligation.'

/**
 * openGraph and twitter are set explicitly here, not inherited.
 *
 * The root layout's social card describes the company in general. Since the
 * site's root URL now sends visitors to this page, that card was what showed
 * up every time anyone shared covenantbuilders.org — in a text message, a
 * Facebook post, an ad preview — so the offer never appeared in the one place
 * people decide whether to click. The card image lives in
 * ./opengraph-image.tsx.
 */
export const metadata: Metadata = {
	title: 'Design Your Project — Free Online Project Planner | Vero Beach, FL',
	description:
		'Design your construction project online in about five minutes and get a written project brief — free, no obligation. New homes, remodels, kitchens, commercial and condo association work on the Treasure Coast.',
	alternates: { canonical: '/design-your-project' },
	openGraph: {
		title: SHARE_TITLE,
		description: SHARE_DESCRIPTION,
		url: '/design-your-project',
		type: 'website',
		// The image comes from ./opengraph-image.tsx — Next.js gives file-based
		// metadata precedence and ignores an `images` array declared here.
	},
	twitter: {
		card: 'summary_large_image',
		title: SHARE_TITLE,
		description: SHARE_DESCRIPTION,
	},
}

/**
 * Section order follows the StoryBrand wireframe: header, stakes, value
 * proposition, guide, plan, agreement, explanatory paragraph. The designer
 * itself sits immediately after the stakes section — the visitor arrives ready
 * to act, and making them scroll past four sections of argument first is how
 * you lose them.
 *
 * The direct call to action reads 'Design your project' in every place it
 * appears sitewide. Do not reword it here.
 */
export default function DesignYourProjectPage() {
	return (
		<>
			<BreadcrumbJsonLd crumbs={[{ name: 'Design Your Project', path: '/design-your-project' }]} />
			<Hero
				compact
				headline="Design your project. Get a straight answer."
				support="Answer a few questions about what you want built. In about five minutes you will have a written project brief — and a licensed Vero Beach builder ready to walk the property with you."
				primaryCta={{ href: '#designer', label: 'Design your project' }}
				secondaryCta={{
					href: siteConfig.phones.sr.href,
					label: `Call ${siteConfig.phones.sr.display}`,
				}}
				imageSrc="/images/portfolio/project-01.jpg"
				imageAlt="A completed Covenant Builders home on the Treasure Coast"
			/>

			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Why this exists"
						title="The most expensive thing in construction is a vague number."
						description="You have probably already had this happen. You describe your project. You get a number. You ask what is in it, and the answer is a shrug."
					/>
					<div className="mt-8 max-w-2xl space-y-5">
						<p className="body-copy">
							So you wait. And a year later you are still describing the same
							project to somebody new — except now materials cost more, and the
							small repair has become a big one.
						</p>
						<p className="body-copy text-navy">
							<strong>
								Nothing about this is your fault. You were never given anything to
								decide with.
							</strong>
						</p>
					</div>
				</div>
			</section>

			<section id="designer" className="scroll-mt-24 bg-white py-20 sm:py-24">
				<div className="section-shell">
					<div className="mx-auto max-w-3xl">
						<ProjectDesigner />
					</div>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="What you get"
						title="What you get in the next five minutes"
					/>
					<div className="mt-12 grid gap-6 md:grid-cols-3">
						{valueProps.map((item) => (
							<div
								key={item.title}
								className="border border-navy/10 bg-white p-7 reveal"
							>
								<h3 className="font-display text-xl tracking-tight text-navy">
									{item.title}
								</h3>
								<p className="mt-3 font-sans text-base leading-relaxed text-stone-muted">
									{item.body}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-navy py-20 text-white sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Who you are working with"
						tone="dark"
						title="We know what it is like to be on your side of this."
						description="You have described your project three times and still have not gotten a real answer. You are not being difficult — you are being careful, and you should be. This is a lot of money and it is your property."
					/>
					<div className="mt-8 max-w-2xl space-y-6">
						<p className="body-copy text-white/80">
							Covenant Builders has been building on the Treasure Coast since{' '}
							{siteConfig.license.licensedYear}. Josias Andujar Sr. holds Florida
							Certified Building Contractor license{' '}
							<strong className="text-sand-light">
								{siteConfig.license.number}
							</strong>
							, active through {siteConfig.license.expires}. You do not have to take
							our word for any of that.
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
					<SectionHeading eyebrow="How it works" title="The Clear Scope Plan" />
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
						<Link href="#designer" className="btn-primary">
							Design your project
						</Link>
					</p>
				</div>
			</section>

			<section className="bg-white py-20 sm:py-24">
				<div className="section-shell">
					<SectionHeading
						eyebrow="Our commitments"
						title="The Straight-Answer Agreement"
						description="Every project we take on, we commit to five things."
					/>
					<ul className="mt-10 max-w-3xl space-y-5">
						{agreement.map((item) => (
							<li
								key={item.lead}
								className="border-l-2 border-sand pl-5 font-sans text-base leading-relaxed text-stone-muted"
							>
								<strong className="text-navy">{item.lead}</strong> {item.rest}
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-24">
				<div className="section-shell">
					<div className="max-w-3xl space-y-5">
						<h2 className="display-title">Why we ask you to design it first</h2>
						<p className="body-copy">
							Most people planning a construction project in Vero Beach start in
							the same place: a folder of saved photos, a rough idea of what they
							want, and no way to find out what it takes. Calling contractors for a
							number before anyone has defined the scope is how projects go wrong —
							because a number without a scope is not a price, it is a guess, and
							guesses get corrected later at your expense.
						</p>
						<p className="body-copy">
							Our project designer inverts that order. You describe what you want
							built. We turn it into a written brief. Then a licensed builder walks
							the property with you and prices what is actually on paper. When a
							contractor gives you a number before seeing the property, one of two
							things is happening: either the number is padded to cover what he has
							not seen, or it is low and the difference comes back to you as change
							orders. Neither is dishonest, exactly. Both cost you.
						</p>
						<p className="body-copy">
							The designer is free and it obligates you to nothing. If you finish
							it, take your brief, and hand it to another builder, that is a fine
							outcome — you will be a better-informed client either way, and
							better-informed clients get better buildings. We would rather compete
							on a written scope than on who guessed lowest.
						</p>
					</div>
				</div>
			</section>
		</>
	)
}

const valueProps = [
	{
		title: 'A project brief you can actually hold',
		body: 'Every choice you make gets written into one clean document — scope, size, finish level, timeline. Email it to your spouse. Take it to your board. It is yours whether you hire us or not.',
	},
	{
		title: 'A builder who has already read it',
		body: 'You will not repeat yourself. When we walk your property, we have read your brief and we come with questions, not a sales pitch.',
	},
	{
		title: 'A number that comes after the scope',
		body: 'We price what is written down. That is the whole method. It is also why our estimates hold.',
	},
] as const

const planSteps = [
	{
		title: 'Design it.',
		body: 'Answer a few questions right here — what you are building, how big, how finished, when. About five minutes. No account, no obligation.',
	},
	{
		title: 'Walk it.',
		body: 'We come to your property and confirm what is actually there. Old plumbing, a wall that turns out to be structural, a slab that is not level. This is the step that separates a real estimate from a guess.',
	},
	{
		title: 'Build it on paper first.',
		body: 'You get a written scope, line by line. You read it. You ask questions. You change it. Then we talk price — and then, and only then, does anyone start work.',
	},
] as const

const agreement = [
	{
		lead: 'We show our license before you ask.',
		rest: 'CBC1253676. Verify it any time.',
	},
	{
		lead: 'We tell you when your idea will not work',
		rest: '— and what will instead.',
	},
	{
		lead: 'You get one point of contact.',
		rest: 'Not a phone tree, not a rotating crew lead.',
	},
	{
		lead: 'Nothing gets built off a verbal.',
		rest: 'Every change goes in writing before it happens.',
	},
	{
		lead: 'If we are not the right builder for your project, we will tell you',
		rest: 'and point you somewhere better.',
	},
] as const
