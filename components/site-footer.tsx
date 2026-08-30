import Image from 'next/image'
import Link from 'next/link'

import { navLinks, siteConfig } from '@/content/site'

export function SiteFooter() {
	const year = new Date().getFullYear()

	return (
		<footer className="relative bg-navy text-white">
			<div className="section-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
				<div className="space-y-5">
					<Image
						src="/images/logo.png"
						alt={siteConfig.name}
						width={320}
						height={80}
						className="h-auto w-48 brightness-0 invert"
					/>
					<p className="max-w-sm font-sans text-sm leading-relaxed text-white/70">
						Florida residential and commercial construction from Vero Beach
						across the Treasure Coast. Licensed, bilingual, and built on
						craftsmanship.
					</p>
					<p className="font-sans text-xs uppercase tracking-[0.18em] text-sand">
						{siteConfig.bilingualNote}
					</p>

					{/*
					 * Only profiles with real activity are listed — see the `social`
					 * block in content/site.ts for which are deliberately omitted.
					 */}
					<ul className="flex items-center gap-4 pt-1">
						{siteConfig.social.map((profile) => (
							<li key={profile.name}>
								<a
									href={profile.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`${siteConfig.name} on ${profile.name}`}
									className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-sand hover:text-sand"
								>
									<SocialIcon name={profile.name} />
								</a>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand">
						Quick links
					</h2>
					<ul className="mt-5 space-y-3">
						{navLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="font-sans text-sm text-white/80 transition hover:text-sand"
								>
									{link.label}
								</Link>
							</li>
						))}
						{/* Investors lives here rather than in the main nav — see content/site.ts */}
						<li>
							<Link
								href="/investors"
								className="font-sans text-sm text-white/80 transition hover:text-sand"
							>
								Investors
							</Link>
						</li>
						<li>
							<Link
								href="/privacy"
								className="font-sans text-sm text-white/80 transition hover:text-sand"
							>
								Privacy
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sand">
						Contact
					</h2>
					<ul className="mt-5 space-y-3 font-sans text-sm text-white/80">
						{/*
						 * De-duplicated: estimating and info currently point at the same
						 * mailbox, and the footer was printing the address twice.
						 */}
						{Array.from(
							new Set([siteConfig.emails.estimating, siteConfig.emails.info]),
						).map((email) => (
							<li key={email}>
								<a
									href={`mailto:${email}`}
									className="transition hover:text-sand"
								>
									{email}
								</a>
							</li>
						))}
						<li>
							<a
								href={siteConfig.phones.sr.href}
								className="transition hover:text-sand"
							>
								{siteConfig.phones.sr.display}
							</a>
						</li>
						<li>
							<a
								href={siteConfig.address.mapsUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="transition hover:text-sand"
							>
								{siteConfig.address.full}
							</a>
						</li>
						<li className="pt-2 text-white/60">
							Hours: Mon–Fri 9:00 AM – 5:00 PM
						</li>
						<li className="text-white/60">
							FL License #{siteConfig.license.number}
						</li>
					</ul>
				</div>
			</div>

			<div className="border-t border-white/10">
				<div className="section-shell flex flex-col gap-2 py-5 font-sans text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {year} {siteConfig.name}. All rights reserved.
					</p>
					<p>
						License CBC1253676 · Active through {siteConfig.license.expires}
					</p>
				</div>
			</div>
		</footer>
	)
}

/**
 * Inline so the footer costs no extra request and the marks inherit
 * currentColor for the hover state. Paths are the official brand glyphs.
 */
function SocialIcon({ name }: { name: string }) {
	if (name === 'Facebook') {
		return (
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				focusable="false"
				fill="currentColor"
				className="h-[18px] w-[18px]"
			>
				<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
			</svg>
		)
	}

	if (name === 'Instagram') {
		return (
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				focusable="false"
				fill="currentColor"
				className="h-[18px] w-[18px]"
			>
				<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.64 3.64 0 0 0-.88-1.35 3.64 3.64 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.82Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
			</svg>
		)
	}

	return null
}
