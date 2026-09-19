import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { Faq } from '@/components/faq'
import { Hero } from '@/components/hero'
import { ProcessTimeline } from '@/components/process-timeline'
import { SectionHeading } from '@/components/section-heading'
import { ServiceJsonLd } from '@/components/service-json-ld'
import { TrustBand } from '@/components/trust-band'
import { servicesFaqs } from '@/content/faqs'
import { serviceSeo } from '@/content/service-seo'
import { services, siteConfig } from '@/content/site'

interface PageProps {
	params: { slug: string }
}

function findService(slug: string) {
	return services.find((service) => service.seoSlug === slug)
}

export function generateStaticParams() {
	return services.map((service) => ({ slug: service.seoSlug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
	const service = findService(params.slug)
	const seo = serviceSeo[params.slug]
	if (!service || !seo) return {}

	return {
		title: seo.metaTitle,
		description: seo.metaDescription,
		alternates: { canonical: `/services/${params.slug}` },
	}
}

export default function ServiceDetailPage({ params }: PageProps) {
	const service = findService(params.slug)
	const seo = serviceSeo[params.slug]
	if (!service || !seo) notFound()

	const relatedServices = services.filter((s) => s.seoSlug !== params.slug)
	const faqItems = servicesFaqs.filter((item) =>
		seo.relevantFaqQuestions.includes(item.question),
	)

	return (
		<>
			<BreadcrumbJsonLd
				crumbs={[
					{ name: 'Services', path: '/services' },
					{ name: service.title, path: `/services/${params.slug}` },
				]}
			/>
			<ServiceJsonLd service={service} path={`/services/${params.slug}`} />

			<Hero
				compact
				headline={seo.h1}
				support={service.description}
				primaryCta={{ href: '/contact', label: 'Request an estimate' }}
				secondaryCta={{ href: '/design-your-project', label: 'Design your project' }}
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow={service.shortTitle}
						title={service.title}
						description={service.summary}
					/>
					<ul className="grid gap-3 sm:grid-cols-2">
						{service.bullets.map((bullet) => (
							<li
								key={bullet}
								className="font-sans text-sm text-ink/80 before:mr-2 before:text-sand before:content-['—']"
							>
								{bullet}
							</li>
						))}
					</ul>
					<div className="flex flex-wrap gap-4">
						<Link href="/contact" className="btn-primary">
							Request an estimate
						</Link>
						<Link href="/portfolio" className="btn-secondary !border-navy !text-navy">
							See related work
						</Link>
					</div>

					{service.process ? (
						<ProcessTimeline
							idPrefix={params.slug}
							stages={service.process}
							note={service.processNote}
						/>
					) : null}
				</div>
			</section>

			<section className="bg-stone-warm py-16 sm:py-20">
				<div className="section-shell space-y-8">
					<SectionHeading
						eyebrow="Service area"
						title={`Where we handle ${service.title.toLowerCase()} on the Treasure Coast`}
						description="Covenant Builders takes on this work across Vero Beach and nearby communities — only places we actually serve."
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
				</div>
			</section>

			<section className="surface-atmosphere py-16 sm:py-20">
				<div className="section-shell space-y-8">
					<SectionHeading
						eyebrow="Other services"
						title="The rest of what we build"
					/>
					<ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
						{relatedServices.map((related) => (
							<li key={related.seoSlug}>
								<Link
									href={`/services/${related.seoSlug}`}
									className="link-underline font-display text-xl text-navy"
								>
									{related.title}
								</Link>
							</li>
						))}
					</ul>
					<p>
						<Link href="/services" className="link-underline font-sans text-sm">
							See all services
						</Link>
					</p>
				</div>
			</section>

			{faqItems.length > 0 ? (
				<Faq
					path={`/services/${params.slug}`}
					eyebrow="Before you call"
					title="The questions people actually ask"
					description="Licence, coverage area, permits, timelines. Have a different one? Ask us and we will answer it the same way."
					items={faqItems}
				/>
			) : null}

			<section className="bg-navy py-20 text-white">
				<div className="section-shell space-y-6">
					<h2 className="display-title text-white">
						Ready to talk through {service.title.toLowerCase()}?
					</h2>
					<p className="max-w-2xl body-copy text-white/75">
						Describe what&apos;s going on in your own words and you&apos;ll get a
						straight answer, not a pitch. Call{' '}
						<a className="text-sand underline" href={siteConfig.phones.sr.href}>
							{siteConfig.phones.sr.display}
						</a>{' '}
						or request an estimate online.
					</p>
					<div className="flex flex-wrap gap-4">
						<Link href="/contact" className="btn-primary">
							Get a free consultation
						</Link>
						<Link href="/design-your-project" className="btn-secondary">
							Design your project
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
