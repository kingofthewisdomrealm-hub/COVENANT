import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { communityCities, findCommunityCity } from '@/content/community'

interface PageProps {
	params: { slug: string }
}

export function generateStaticParams() {
	return communityCities.map((city) => ({ slug: city.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
	const city = findCommunityCity(params.slug)
	if (!city) return {}
	return {
		title: city.metaTitle,
		description: city.metaDescription,
		alternates: { canonical: `/community/${params.slug}` },
	}
}

export default function CommunityCityPage({ params }: PageProps) {
	const city = findCommunityCity(params.slug)
	if (!city) notFound()

	return (
		<>
			<BreadcrumbJsonLd
				crumbs={[
					{ name: 'Community', path: '/community' },
					{ name: city.cityName, path: `/community/${city.slug}` },
				]}
			/>
			<Hero
				compact
				headline={city.h1}
				support={city.heroSupport}
				primaryCta={{ href: '/homeowner-programs', label: 'See money programs' }}
				secondaryCta={{ href: '/contact', label: 'Talk to us' }}
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-16">
					<SectionHeading
						eyebrow={city.county}
						title={`What's actually available in ${city.cityName}`}
						description={city.intro}
					/>

					<div className="space-y-10">
						<div>
							<p className="eyebrow">Money for repairs and improvements</p>
							<ul className="mt-6 space-y-8">
								{city.programs.map((program) => (
									<li
										key={program.name}
										className="border-t border-navy/10 pt-6"
									>
										<h3 className="font-display text-2xl text-navy">
											{program.name}
										</h3>
										<p className="mt-2 max-w-2xl body-copy">
											{program.description}
										</p>
										<p className="mt-2 font-sans text-sm font-semibold text-ink/70">
											{program.status}
										</p>
										<a
											href={program.link}
											target={
												program.link.startsWith('/') ? undefined : '_blank'
											}
											rel={
												program.link.startsWith('/')
													? undefined
													: 'noopener noreferrer'
											}
											className="link-underline mt-3 inline-block font-semibold"
										>
											{program.link.startsWith('/')
												? 'See details →'
												: 'Official source →'}
										</a>
									</li>
								))}
							</ul>
						</div>

						<div className="grid gap-10 border-t border-navy/10 pt-10 sm:grid-cols-2">
							<div>
								<p className="eyebrow">Permits</p>
								<h3 className="mt-3 font-display text-2xl text-navy">
									{city.permitOffice.name}
								</h3>
								<p className="mt-2 max-w-md body-copy">
									{city.permitOffice.note}
								</p>
								<a
									href={city.permitOffice.link}
									target="_blank"
									rel="noopener noreferrer"
									className="link-underline mt-3 inline-block font-semibold"
								>
									Official permits page →
								</a>
							</div>
							<div>
								<p className="eyebrow">Local business</p>
								<h3 className="mt-3 font-display text-2xl text-navy">
									{city.chamber.name}
								</h3>
								<p className="mt-2 max-w-md body-copy">{city.chamber.note}</p>
								<a
									href={city.chamber.link}
									target="_blank"
									rel="noopener noreferrer"
									className="link-underline mt-3 inline-block font-semibold"
								>
									Visit the chamber →
								</a>
							</div>
						</div>

						<div className="border-t border-navy/10 pt-10">
							<p className="eyebrow">Storm season</p>
							<h3 className="mt-3 font-display text-2xl text-navy">
								Check what&apos;s actually hit your area
							</h3>
							<p className="mt-2 max-w-2xl body-copy">
								Our storm check tool pulls real National Weather Service local
								storm reports by ZIP code — hail, wind, and tornado events — so
								you can see documented history for your address, not a guess.
							</p>
							<Link
								href="/storm-check"
								className="link-underline mt-3 inline-block font-semibold"
							>
								Check your ZIP code →
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-stone-warm py-16 sm:py-20">
				<div className="section-shell max-w-2xl space-y-5">
					<SectionHeading eyebrow="Where we fit in" title="Our own presence here" />
					<p className="body-copy">{city.ourWork}</p>
					<p className="max-w-xl body-copy">
						This page exists to be useful whether or not you ever call us. If
						you are taking on a project in {city.cityName}, we are happy to
						talk it through.
					</p>
					<Link href="/contact" className="btn-primary inline-block w-fit">
						Talk to us
					</Link>
				</div>
			</section>

			<section className="surface-atmosphere py-10">
				<div className="section-shell">
					<p className="font-sans text-xs text-ink/50">
						Program details verified {city.verifiedAsOf}. Applications, funding
						windows, and eligibility rules change — confirm current status with
						the linked source before relying on anything above.
					</p>
				</div>
			</section>
		</>
	)
}
