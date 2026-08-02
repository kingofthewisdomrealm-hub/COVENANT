import Image from 'next/image'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { ProjectGallery } from '@/components/project-gallery'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import {
	referenceOffer,
	services,
	siteConfig,
	whyChooseUs,
} from '@/content/site'

export default function HomePage() {
	return (
		<>
			{/*
			 * The headline names the visitor's actual fear — hiring the wrong
			 * contractor — and answers it with the one thing competitors can't
			 * copy: a licence you can check in thirty seconds.
			 * See docs/website-copy-plan.md.
			 */}
			<Hero
				headline="A Florida builder you can verify before you call"
				support="Licensed since 2005 — CBC1253676. Homes, kitchens, commercial projects, remodels, and storm restoration across Vero Beach and the Treasure Coast."
				primaryCta={{ href: '/contact', label: 'Request an estimate' }}
				secondaryCta={{
					href: siteConfig.phones.sr.href,
					label: `Call ${siteConfig.phones.sr.display}`,
				}}
			/>

			{/* The proof the headline promises — second thing on the page, not fifth. */}
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
					<div className="reveal space-y-5">
						<p className="eyebrow">{referenceOffer.eyebrow}</p>
						<h2 className="display-title">{referenceOffer.title}</h2>
						<p className="font-display text-2xl leading-snug text-navy">
							{referenceOffer.lead}
						</p>
						<p className="body-copy">{referenceOffer.body}</p>
						<div className="flex flex-wrap gap-4 pt-2">
							<a href={siteConfig.phones.sr.href} className="btn-primary">
								Call {siteConfig.phones.sr.display}
							</a>
							<a
								href={`mailto:${siteConfig.emails.estimating}`}
								className="btn-secondary"
							>
								Email us
							</a>
						</div>
					</div>
					<div className="relative">
						<div className="absolute -left-4 -top-4 h-full w-full bg-sand/30" />
						<div className="relative overflow-hidden">
							<Image
								src="/images/intro.webp"
								alt="Covenant Builders team reviewing plans on a renovation project"
								width={984}
								height={656}
								className="h-auto w-full object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-navy py-20 text-white sm:py-28">
				<div className="section-shell space-y-12">
					<SectionHeading
						eyebrow="Our services"
						title="What we build"
						description="Clear offerings with honest descriptions—so you know exactly what Covenant Builders can deliver."
						tone="dark"
					/>
					<ul className="grid gap-8 md:grid-cols-2">
						{services.map((service) => (
							<li key={service.slug} className="border-t border-white/15 pt-6">
								<h3 className="font-display text-3xl text-white">
									{service.title}
								</h3>
								<p className="mt-3 max-w-md font-sans text-base leading-relaxed text-white/75">
									{service.summary}
								</p>
								<Link
									href={`/services#${service.slug}`}
									className="mt-5 inline-flex font-sans text-xs font-semibold uppercase tracking-[0.16em] text-sand transition hover:text-sand-light"
								>
									Explore {service.shortTitle.toLowerCase()}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-12">
					<SectionHeading
						eyebrow="Why Covenant"
						title="Five reasons to call us"
						description="No inflated counters. No placeholder praise. Every one of these you can check."
					/>
					<ul className="grid gap-8 sm:grid-cols-2">
						{whyChooseUs.map((item) => (
							<li key={item.title} className="space-y-3">
								<h3 className="font-display text-2xl text-navy">{item.title}</h3>
								<p className="body-copy">{item.description}</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
						<SectionHeading
							eyebrow="Portfolio"
							title="Selected work"
							description="A look at planning, cabinetry, and construction from recent Treasure Coast jobs. More completed projects are on the way."
						/>
						<Link href="/portfolio" className="link-underline shrink-0">
							Full portfolio
						</Link>
					</div>
					<ProjectGallery limit={3} showFilters={false} />
				</div>
			</section>

			<section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
				<div className="absolute inset-0 bg-gradient-to-r from-navy via-navy to-navy-soft" />
				<div className="section-shell relative space-y-6">
					{/*
					 * Closes on the same argument the hero opens with — check us first.
					 * Avoids drifting back into brochure language at the last moment.
					 */}
					<p className="eyebrow !text-sand">Ready when you are</p>
					<h2 className="max-w-3xl font-display text-4xl sm:text-5xl">
						Check the licence. Then let&rsquo;s talk about your project.
					</h2>
					<p className="max-w-xl body-copy text-white/75">
						Tell us what you are building and we will come look at it. Estimates
						are free, and we typically reply within one business day.
					</p>
					<div className="flex flex-wrap gap-4 pt-2">
						<Link href="/contact" className="btn-primary">
							Request an estimate
						</Link>
						<a href={siteConfig.phones.sr.href} className="btn-secondary">
							Call {siteConfig.phones.sr.display}
						</a>
					</div>
				</div>
			</section>
		</>
	)
}
