import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { services, siteConfig } from '@/content/site'

export const metadata: Metadata = {
	title: 'Custom Homes, Kitchens & Commercial Construction | Vero Beach, FL',
	description:
		'New home builds, custom kitchens and cabinetry, commercial projects, and remodels from licensed Florida builder CBC1253676 in Vero Beach and the Treasure Coast.',
	alternates: { canonical: '/services' },
}

export default function ServicesPage() {
	return (
		<>
			<Hero
				compact
				headline="Services built around real project needs"
				support="Our services cover residential construction, custom kitchens, commercial builds, and renovations—with clear scope and licensed accountability."
				primaryCta={{ href: '/contact', label: 'Request an estimate' }}
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-16">
					<SectionHeading
						eyebrow="Capabilities"
						title="How we help you build"
						description="Each service below matches what we actually deliver—no swapped template copy."
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
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="bg-navy py-20 text-white">
				<div className="section-shell space-y-6">
					<h2 className="display-title text-white">
						Need something specific?
					</h2>
					<p className="max-w-2xl body-copy text-white/75">
						If you have a unique vision or a particular requirement, we are here
						to bring it to life. Call{' '}
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
