import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Hero } from '@/components/hero'
import { SectionHeading } from '@/components/section-heading'
import { TrustBand } from '@/components/trust-band'
import { founderBio, siteConfig, whyChooseUs } from '@/content/site'

export const metadata: Metadata = {
	title: 'About Josias Andujar & Covenant Builders',
	description:
		'Meet Josias Andujar, Florida Certified Building Contractor CBC1253676, and the Covenant Builders story on the Treasure Coast.',
	alternates: { canonical: '/about' },
}

export default function AboutPage() {
	return (
		<>
			<Hero
				compact
				headline="A licensed builder rooted in craft"
				support="Covenant Builders is led by Josias Andujar—cabinetmaker by training, Florida Certified Building Contractor by credential, and Treasure Coast builder by home."
				primaryCta={{ href: '/contact', label: 'Work with us' }}
				imageSrc="/images/about-team.jpeg"
				imageAlt="Covenant Builders team reviewing construction plans"
			/>
			<TrustBand />

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell grid gap-12 lg:grid-cols-[1fr_1.1fr]">
					<div className="space-y-4">
						<p className="eyebrow">Our president and founder</p>
						<h2 className="display-title">{founderBio.name}</h2>
						<p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-sand-dark">
							{founderBio.title}
						</p>
						<div className="relative mt-8 overflow-hidden">
							<Image
								src="/images/about-team.jpeg"
								alt="Josias Andujar and team reviewing plans"
								width={960}
								height={640}
								className="h-auto w-full object-cover"
							/>
						</div>
					</div>

					<div className="space-y-5">
						{founderBio.paragraphs.map((paragraph) => (
							<p key={paragraph.slice(0, 32)} className="body-copy">
								{paragraph}
							</p>
						))}
						<p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-sand-dark">
							{siteConfig.bilingualNote}
						</p>
					</div>
				</div>
			</section>

			<section className="bg-navy py-20 text-white">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow="Credentials"
						title="What you can verify"
						description="These facts come from Florida DBPR public records—not marketing placeholders."
						tone="dark"
					/>
					<dl className="grid gap-8 sm:grid-cols-2">
						<div>
							<dt className="font-sans text-xs uppercase tracking-[0.18em] text-sand">
								License number
							</dt>
							<dd className="mt-2 font-display text-3xl">
								{siteConfig.license.number}
							</dd>
						</div>
						<div>
							<dt className="font-sans text-xs uppercase tracking-[0.18em] text-sand">
								Classification
							</dt>
							<dd className="mt-2 font-display text-3xl">
								{siteConfig.license.classification}
							</dd>
						</div>
						<div>
							<dt className="font-sans text-xs uppercase tracking-[0.18em] text-sand">
								Originally licensed
							</dt>
							<dd className="mt-2 font-display text-3xl">
								{siteConfig.license.licensedSince}
							</dd>
						</div>
						<div>
							<dt className="font-sans text-xs uppercase tracking-[0.18em] text-sand">
								Status
							</dt>
							<dd className="mt-2 font-display text-3xl">
								{siteConfig.license.status} · expires {siteConfig.license.expires}
							</dd>
						</div>
						<div className="sm:col-span-2">
							<dt className="font-sans text-xs uppercase tracking-[0.18em] text-sand">
								License DBA
							</dt>
							<dd className="mt-2 max-w-3xl font-sans text-lg text-white/80">
								Registered as {siteConfig.license.dba}; operating as{' '}
								{siteConfig.name}.
							</dd>
						</div>
					</dl>
					<a
						href={siteConfig.license.dbprLookupUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex font-sans text-sm text-sand underline-offset-4 hover:underline"
					>
						Verify on Florida DBPR
					</a>
				</div>
			</section>

			<section className="surface-atmosphere py-20 sm:py-28">
				<div className="section-shell space-y-10">
					<SectionHeading
						eyebrow="Why us"
						title="Here’s why clients trust the process"
					/>
					<ul className="grid gap-8 sm:grid-cols-2">
						{whyChooseUs.map((item) => (
							<li key={item.title} className="space-y-2">
								<h3 className="font-display text-2xl text-navy">{item.title}</h3>
								<p className="body-copy">{item.description}</p>
							</li>
						))}
					</ul>
					<Link href="/contact" className="btn-primary">
						Start a conversation
					</Link>
				</div>
			</section>
		</>
	)
}
