import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact-form'
import { Hero } from '@/components/hero'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
	title: 'Contact & Free Estimate — Vero Beach',
	description:
		'Request a free estimate from Covenant Builders. Call Josias Andujar Sr or Jr, or email estimating@covenantbuilders.org.',
	alternates: { canonical: '/contact' },
}

export default function ContactPage() {
	return (
		<>
			<Hero
				compact
				headline="Let’s talk about your project"
				support="Better yet, see us in person—or send the details online. We stay in communication until the job is done."
				primaryCta={{ href: '#estimate-form', label: 'Request an estimate' }}
				secondaryCta={{
					href: siteConfig.phones.sr.href,
					label: `Call ${siteConfig.phones.sr.display}`,
				}}
			/>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
					<div className="space-y-10">
						<div>
							<p className="eyebrow">Direct contacts</p>
							<h2 className="mt-3 display-title">People who answer</h2>
							<p className="mt-4 body-copy">
								{siteConfig.responseExpectation} For project inquiries, use the
								form or email{' '}
								<a
									className="text-navy underline"
									href={`mailto:${siteConfig.emails.estimating}`}
								>
									{siteConfig.emails.estimating}
								</a>
								.
							</p>
						</div>

						<ul className="space-y-8">
							<li className="border-t border-navy/10 pt-6">
								<h3 className="font-display text-2xl leading-snug text-navy">
									{siteConfig.phones.sr.name}
								</h3>
								<p className="mt-3 font-sans text-sm uppercase tracking-[0.16em] text-sand-dark">
									{siteConfig.phones.sr.role}
								</p>
								<p className="mt-3 font-sans text-base text-ink">
									<a href={siteConfig.phones.sr.href} className="hover:text-sand-dark">
										{siteConfig.phones.sr.display}
									</a>
								</p>
								<p className="mt-1 font-sans text-base text-ink">
									<a
										href={`mailto:${siteConfig.emails.josias}`}
										className="hover:text-sand-dark"
									>
										{siteConfig.emails.josias}
									</a>
								</p>
							</li>
							<li className="border-t border-navy/10 pt-6">
								<h3 className="font-display text-2xl leading-snug text-navy">
									{siteConfig.phones.jr.name}
								</h3>
								<p className="mt-3 font-sans text-sm uppercase tracking-[0.16em] text-sand-dark">
									{siteConfig.phones.jr.role}
								</p>
								<p className="mt-3 font-sans text-base text-ink">
									<a href={siteConfig.phones.jr.href} className="hover:text-sand-dark">
										{siteConfig.phones.jr.display}
									</a>
								</p>
							</li>
							<li className="border-t border-navy/10 pt-6">
								<h3 className="font-display text-2xl text-navy">Office</h3>
								<p className="mt-3 font-sans text-base text-ink">
									<a
										href={siteConfig.address.mapsUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-sand-dark"
									>
										{siteConfig.address.full}
									</a>
								</p>
								<p className="mt-2 font-sans text-sm text-stone-muted">
									{siteConfig.bilingualNote}
								</p>
							</li>
						</ul>

						<div>
							<h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sand-dark">
								Hours
							</h3>
							<ul className="mt-4 space-y-2">
								{siteConfig.hours.map((item) => (
									<li
										key={item.day}
										className="flex justify-between gap-4 border-b border-navy/10 py-2 font-sans text-sm text-ink"
									>
										<span>{item.day}</span>
										<span className="text-stone-muted">{item.time}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div id="estimate-form">
						<p className="eyebrow mb-4">Free estimate</p>
						<h2 className="mb-6 display-title">Tell us what you’re building</h2>
						<ContactForm />
					</div>
				</div>
			</section>
		</>
	)
}
