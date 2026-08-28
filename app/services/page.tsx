import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { ProcessTimeline } from '@/components/process-timeline'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { services, siteConfig } from '@/content/site'

export const metadata: Metadata = {
	title: 'Custom Homes, Kitchens, Commercial & Storm Restoration | Vero Beach, FL',
	description:
		'New home builds, custom kitchens and cabinetry, commercial projects, remodels, and storm restoration from licensed Florida builder CBC1253676 in Vero Beach and the Treasure Coast. See our step-by-step process for every service.',
	alternates: { canonical: '/services' },
}

export default function ServicesPage() {
	return (
		<>
			<Hero
				compact
				headline="Most construction stress isn't the construction."
				support="It's the not knowing — what it really costs, how long it really takes, and who answers when something goes wrong. Every service below comes with the same fix: a written scope before work starts, a step-by-step process you can read before you sign, and one licensed builder accountable from start to finish."
				primaryCta={{ href: '/contact', label: 'Request an estimate' }}
				secondaryCta={{ href: '/design-your-project', label: 'Design your project' }}
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-16">
					<SectionHeading
						eyebrow="What we build"
						title="Five ways we take a project off your shoulders"
						description="Each service opens with the problem it solves, then shows you the full process, step by step, with honest durations. Read it before you sign anything — that is what it is for."
					/>

					<ul className="space-y-16">
						{services.map((service, index) => (
							<li
								key={service.slug}
								id={service.slug}
								className="grid gap-8 border-t border-navy/10 pt-12 lg:grid-cols-[160px_1fr]"
							>
								<p className="font-display text-5xl text-sand">
									{String(index + 1).padStart(2, '0')}
								</p>
								<div className="space-y-5">
									<h2 className="font-display text-4xl leading-snug text-navy">
										{service.title}
									</h2>
									<p className="max-w-2xl body-copy">{service.description}</p>
									<ul className="grid gap-2 sm:grid-cols-2">
										{service.bullets.map((bullet) => (
											<li
												key={bullet}
												className="font-sans text-sm text-ink/80 before:mr-2 before:text-sand before:content-['—']"
											>
												{bullet}
											</li>
										))}
									</ul>
									<div className="flex flex-wrap gap-6">
										<Link href="/contact" className="link-underline">
											Start this project
										</Link>
										<Link href="/portfolio" className="link-underline">
											See related work
										</Link>
									</div>

									{service.process ? (
										<ProcessTimeline
											idPrefix={service.slug}
											stages={service.process}
											note={service.processNote}
										/>
									) : null}
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="bg-navy py-20 text-white">
				<div className="section-shell space-y-6">
					<h2 className="display-title text-white">
						Not sure which of these is yours?
					</h2>
					<p className="max-w-2xl body-copy text-white/75">
						You don&apos;t need the construction words — describe what&apos;s
						going on in your own words and you&apos;ll get a straight answer, not
						a pitch. Call{' '}
						<a className="text-sand underline" href={siteConfig.phones.sr.href}>
							{siteConfig.phones.sr.display}
						</a>{' '}
						or request an estimate online.
					</p>
					<div className="flex flex-wrap gap-4">
						<Link href="/contact" className="btn-primary">
							Get a free consultation
						</Link>
						<Link href="/portfolio" className="btn-secondary">
							See our work
						</Link>
					</div>
				</div>
			</section>

			<section className="surface-atmosphere py-16 sm:py-20">
				<div className="section-shell space-y-8">
					<SectionHeading
						eyebrow="Service areas"
						title="Where we build on the Treasure Coast"
						description="Covenant Builders takes residential and commercial projects across Vero Beach and nearby communities — only places we actually serve."
					/>
					<ul className="flex flex-wrap gap-x-8 gap-y-3">
						{siteConfig.serviceCities.map((city) => (
							<li
								key={city}
								className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-navy/80"
							>
								{city}
							</li>
						))}
						<li className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-navy/80">
							Treasure Coast
						</li>
					</ul>
					<p className="max-w-2xl body-copy">
						Hours: Monday–Friday, 9:00 AM – 5:00 PM. Not sure if your address is
						in range?{' '}
						<Link href="/contact" className="link-underline">
							Ask us
						</Link>
						.
					</p>
				</div>
			</section>
		</>
	)
}
