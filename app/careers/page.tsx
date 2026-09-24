import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { CareersForm } from '@/components/careers-form'
import { Hero } from '@/components/hero'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
	title: 'Careers | Build With Covenant Builders in Vero Beach, FL',
	description:
		'Apply to join the Covenant Builders team on the Treasure Coast. A short application, one optional resume, and a real person reads every one.',
	alternates: { canonical: '/careers' },
}

const steps = [
	{ title: 'Apply', body: 'Seven quick fields. A resume helps, but it is optional.' },
	{ title: 'We read it', body: 'A real person on our team reviews every application.' },
	{ title: 'We reach out', body: 'If there may be a fit, we call or email you.' },
]

export default function CareersPage() {
	return (
		<>
			<BreadcrumbJsonLd crumbs={[{ name: 'Careers', path: '/careers' }]} />
			<Hero
				compact
				headline="Build With Covenant"
				support="We're always looking for motivated people who want to grow, work hard, and be part of a strong team."
				primaryCta={{ href: '#apply', label: 'Apply Now' }}
				imageSrc="/images/hero.jpg"
				imageAlt="Covenant Builders crew work on the Treasure Coast"
			/>

			<section className="surface-atmosphere py-16 sm:py-24">
				<div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
					<div className="space-y-8 lg:pt-2">
						<div>
							<p className="eyebrow">Careers</p>
							<h2 className="mt-3 display-title">Join the team</h2>
							<p className="mt-4 body-copy">
								Tell us a little about yourself. If we think there may be a fit, our team will reach
								out.
							</p>
						</div>

						<ol className="space-y-5">
							{steps.map((step, i) => (
								<li key={step.title} className="flex gap-4 border-t border-navy/10 pt-5">
									<span className="flex h-9 w-9 shrink-0 items-center justify-center bg-navy font-sans text-sm font-semibold text-sand">
										{i + 1}
									</span>
									<div>
										<h3 className="font-sans text-base font-semibold text-navy">{step.title}</h3>
										<p className="mt-1 font-sans text-sm leading-relaxed text-stone-muted">{step.body}</p>
									</div>
								</li>
							))}
						</ol>

						<p className="hidden font-sans text-sm text-stone-muted lg:block">
							{siteConfig.bilingualNote}
						</p>
					</div>

					<div id="apply" className="scroll-mt-28">
						<p className="eyebrow mb-4">Application</p>
						<h2 className="mb-6 display-title">Apply now</h2>
						<CareersForm />
					</div>
				</div>
			</section>
		</>
	)
}
