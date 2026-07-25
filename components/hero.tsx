import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/content/site'

interface HeroProps {
	headline: string
	support: string
	primaryCta?: { href: string; label: string }
	secondaryCta?: { href: string; label: string }
	imageSrc?: string
	imageAlt?: string
	compact?: boolean
}

export function Hero({
	headline,
	support,
	primaryCta = { href: '/contact', label: 'Contact us' },
	secondaryCta,
	imageSrc = '/images/intro.webp',
	imageAlt = 'Covenant Builders construction craftsmanship on the Treasure Coast',
	compact = false,
}: HeroProps) {
	return (
		<section
			className={`relative isolate overflow-hidden bg-navy text-white ${
				compact ? 'min-h-[58vh]' : 'min-h-[100svh]'
			}`}
		>
			<Image
				src={imageSrc}
				alt={imageAlt}
				fill
				priority
				sizes="100vw"
				className="object-cover animate-fade-in"
			/>
			<div className="absolute inset-0 bg-hero-veil" />
			<div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />

			<div
				className={`section-shell relative flex flex-col justify-end ${
					compact ? 'pb-16 pt-36' : 'pb-20 pt-40 sm:pb-28 sm:pt-48'
				}`}
			>
				<p className="animate-fade-rise font-display text-3xl tracking-tight text-white sm:text-5xl md:text-6xl">
					{siteConfig.name}
				</p>
				<p className="mt-2 animate-fade-rise-delay font-sans text-xs font-semibold uppercase tracking-[0.28em] text-sand">
					{siteConfig.tagline}
				</p>
				<h1 className="mt-8 max-w-3xl animate-fade-rise-delay font-sans text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-4xl">
					{headline}
				</h1>
				<p className="mt-5 max-w-xl animate-fade-rise-delay-2 body-copy text-white/80">
					{support}
				</p>
				<div className="mt-9 flex flex-wrap gap-4 animate-fade-rise-delay-2">
					<Link href={primaryCta.href} className="btn-primary">
						{primaryCta.label}
					</Link>
					{secondaryCta ? (
						<Link href={secondaryCta.href} className="btn-secondary">
							{secondaryCta.label}
						</Link>
					) : null}
				</div>
			</div>
		</section>
	)
}
