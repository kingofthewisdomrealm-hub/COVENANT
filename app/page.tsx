import Image from 'next/image'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { ProjectGallery } from '@/components/project-gallery'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { services, siteConfig, whyChooseUs } from '@/content/site'

export default function HomePage() {
	return (
		<>
			<Hero
				headline="Building your vision with quality and precision"
				support="From custom homes to commercial properties and dream kitchens, we make your project a reality across Vero Beach and the Treasure Coast."
				primaryCta={{ href: '/contact', label: 'Contact us' }}
				secondaryCta={{ href: '/portfolio', label: 'View work' }}
			/>

			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell grid items-center gap-12 lg:grid-cols-2">
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
					<div className="reveal space-y-5">
						<p className="eyebrow">Introduction</p>
						<h2 className="display-title">We build your dreams</h2>
						<p className="body-copy">
							At Covenant Builders, we specialize in creating exceptional spaces.
							Whether you are expanding with a commercial property, building a
							custom home, or upgrading your kitchen with high-end cabinetry, we
							deliver a seamless start-to-finish construction process.
						</p>
						<p className="body-copy">
							With decades of licensed experience and a commitment to quality, we
							work to complete your project on time, within budget, and to a
							standard you can stand behind.
						</p>
						<p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-sand-dark">
							{siteConfig.bilingualNote}
						</p>
						<Link href="/about" className="link-underline">
							Meet the builder
						</Link>
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
									href="/services"
									className="mt-5 inline-flex font-sans text-xs font-semibold uppercase tracking-[0.16em] text-sand transition hover:text-sand-light"
								>
									Explore services
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-12">
					<SectionHeading
						eyebrow="Why choose us"
						title="A builder you can verify"
						description="No inflated counters. No placeholder praise. Just licensed accountability, craftsmanship, and clear communication."
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

			<section className="bg-stone-warm py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
						<SectionHeading
							eyebrow="Portfolio"
							title="Selected work"
							description="A starting gallery from available project photography. More documented case studies are on the way."
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
					<p className="eyebrow !text-sand">Ready when you are</p>
					<h2 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
						Ready to start building your vision?
					</h2>
					<p className="max-w-xl body-copy text-white/75">
						Contact Covenant Builders today for a free consultation and let us
						turn your ideas into reality.
					</p>
					<div className="flex flex-wrap gap-4 pt-2">
						<Link href="/contact" className="btn-primary">
							Get your free consultation
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
