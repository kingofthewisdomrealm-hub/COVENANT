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
