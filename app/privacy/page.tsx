import type { Metadata } from 'next'
import Link from 'next/link'

import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description: `How ${siteConfig.name} handles contact form and inquiry information.`,
	alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
	return (
		<section className="surface-atmosphere pb-24 pt-36">
			<div className="section-shell max-w-3xl space-y-6">
				<p className="eyebrow">Legal</p>
				<h1 className="display-title">Privacy Policy</h1>
				<p className="body-copy">
					This page explains how {siteConfig.name} handles information you submit
					through our website.
				</p>

				<div className="space-y-4">
					<h2 className="font-display text-2xl text-navy">Information we collect</h2>
					<p className="body-copy">
						When you use our estimate form, we collect the name, email address,
						phone number, project address, project type, and message you provide.
					</p>
					<p className="body-copy">
						When you use our project designer, we collect the same contact details
						together with the project answers you select — property type, city,
						scope, size, finish level, board stage, timeline, and budget range —
						and any notes you add.
					</p>
					<p className="body-copy">
						When you apply through our careers page, we collect your name, phone
						number, email address, city and state, anything you choose to tell us,
						and the resume you upload. Applications and resumes are stored privately,
						are seen only by the Covenant Builders team, and are used only to
						consider you for work with us.
					</p>
					<p className="body-copy">
						When you browse this site, we record which pages you view and which
						buttons you tap (for example the phone number), how you arrived (a
						search engine, a social post, a flyer code, or a referral link), the
						approximate city of your connection, and a one-way fingerprint of your
						network address that lets us count visitors without identifying them.
						For visitors connecting from Florida we also keep the network (IP)
						address itself for up to 30 days, to recognise repeat visits and filter
						out automated traffic; it is then deleted. We do not use advertising
						cookies. To opt out of visit counting in your browser, open any page
						on this site with <code>?notrack=1</code> added to the address.
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="font-display text-2xl text-navy">How we use it</h2>
					<p className="body-copy">
						We use inquiry details solely to respond to your request, prepare
						estimates, and communicate about potential or active projects. We do
						not sell your information.
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="font-display text-2xl text-navy">Where it goes</h2>
					<p className="body-copy">
						Form submissions are emailed to{' '}
						{siteConfig.emails.estimating} using our email delivery provider
						(Resend). Standard email and hosting providers may process message
						data as part of delivery.
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="font-display text-2xl text-navy">Retention</h2>
					<p className="body-copy">
						We retain inquiry records as needed for business communication and
						project follow-up, then delete or archive them according to ordinary
						business practices.
					</p>
				</div>

				<div className="space-y-4">
					<h2 className="font-display text-2xl text-navy">Contact</h2>
					<p className="body-copy">
						Questions about this policy can be sent to{' '}
						<a
							className="underline"
							href={`mailto:${siteConfig.emails.info}`}
						>
							{siteConfig.emails.info}
						</a>{' '}
						or by calling{' '}
						<a className="underline" href={siteConfig.phones.sr.href}>
							{siteConfig.phones.sr.display}
						</a>
						.
					</p>
				</div>

				<Link href="/contact" className="link-underline">
					Back to contact
				</Link>
			</div>
		</section>
	)
}
