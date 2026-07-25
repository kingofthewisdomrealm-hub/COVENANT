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
						<li>
							<a
								href={`mailto:${siteConfig.emails.estimating}`}
								className="transition hover:text-sand"
							>
								{siteConfig.emails.estimating}
							</a>
						</li>
						<li>
							<a
								href={`mailto:${siteConfig.emails.info}`}
								className="transition hover:text-sand"
							>
								{siteConfig.emails.info}
							</a>
						</li>
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
