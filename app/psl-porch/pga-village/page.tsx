import type { Metadata } from 'next'
import Link from 'next/link'

import { EditionLogo } from '@/components/porch/edition-logo'
import { siteConfig } from '@/content/site'
import { getPublishedPorchArticles, type PorchArticle } from '@/lib/porch-articles'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

/**
 * PGA Village Lobby Edition — the online twin of the printed one-pager in the
 * PGA Village lobby (Castle Group, 9200 One Putt Place). The printed QR code
 * opens this page with utm_source=partner-pga-village&utm_medium=print.
 */
const ed = PORCH_EDITIONS.psl

const STORIES: { slug: string; img: string; alt: string; caption?: string }[] = [
	{
		slug: 'st-lucie-county-senior-widow-veteran-property-tax-exemptions-march-1',
		img: '/porch/pga-village/march-1.svg',
		alt: 'Drawing of a calendar page reading March 1 beside a house',
	},
	{
		slug: 'port-st-lucie-hoa-owners-board-members-florida-hoa-laws',
		img: '/porch/pga-village/lake-tradition.jpg',
		alt: 'Lake Tradition in Port St. Lucie at twilight',
		caption: 'Lake Tradition, Port St. Lucie',
	},
	{
		slug: 'port-st-lucie-2026-27-tax-rate-trash-fee-credit',
		img: '/porch/pga-village/psl-city-hall.jpg',
		alt: 'Port St. Lucie City Hall',
		caption: 'Port St. Lucie City Hall',
	},
	{
		slug: 'do-i-need-a-permit-port-st-lucie-fences-sheds-pools',
		img: '/porch/pga-village/permits.svg',
		alt: 'Drawing of a house, a fence and a shed',
	},
]

const SPONSORS = [
	{
		name: 'LegalShield',
		text: 'Legal plans and identity theft protection for individuals, families and small businesses.',
		href: 'https://josias.legalshieldassociate.com/',
		label: 'josias.legalshieldassociate.com',
	},
	{
		name: 'Emotional Damage',
		text: 'A short book about the old hurts that still shape how we talk, stay and leave.',
		href: 'https://emotionaldamage.fyi',
		label: 'emotionaldamage.fyi',
	},
	{
		name: 'Ruler of Wisdom',
		text: 'A show of deep conversations on money, purpose, coaching, spirituality and health.',
		href: 'https://rulerofwisdom.com/episodes/',
		label: 'rulerofwisdom.com',
	},
]

export const metadata: Metadata = {
	title: { absolute: `${ed.name} · PGA Village Lobby Edition` },
	description:
		'Picked for PGA Village homeowners: tax breaks for seniors, widows and veterans, Florida’s newer HOA laws, Port St. Lucie’s tax rate and trash credit, and permits.',
	alternates: { canonical: `${ed.basePath}/pga-village` },
}

export default function PgaVillageLobbyPage() {
	const published = getPublishedPorchArticles('psl')
	const stories = STORIES.map((s) => ({ ...s, a: published.find((a) => a.slug === s.slug) })).filter(
		(s): s is (typeof STORIES)[number] & { a: PorchArticle } => Boolean(s.a),
	)
	const phone = siteConfig.phones.porch
	const base = ed.basePath

	return (
		<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
			<div className="section-shell max-w-4xl">
				<header className="border-y-4 border-double border-navy py-5 text-center">
					{ed.logo ? (
						<div className="mb-2 flex justify-center">
							<Link href={base} aria-label={ed.name}>
								<EditionLogo ed={ed} width={84} />
							</Link>
						</div>
					) : null}
					<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-muted">
						<Link href={base} className="hover:text-navy">
							{ed.name}
						</Link>{' '}
						· Lobby Edition
					</p>
					<h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-navy sm:text-5xl">PGA Village</h1>
					<p className="mt-2 font-display text-lg italic text-sand-dark">{ed.tagline}</p>
				</header>

				<p className="mt-8 text-center font-display text-xl leading-relaxed text-navy">
					Picked for PGA Village homeowners: the property tax breaks for seniors, widows and veterans (file by March 1), what
					Florida’s newer HOA laws now require, Port St. Lucie’s tax rate and trash credit, and which home projects need a
					permit.
				</p>

				<div className="mt-10 grid gap-10 sm:grid-cols-2">
					{stories.map(({ a, img, alt, caption }, i) => (
						<article key={a.slug} className="border-t-2 border-navy pt-4">
							<Link href={`${base}/${a.slug}`} className="group block">
								<figure>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={img} alt={alt} className="aspect-[16/9] w-full bg-[#efe7d6] object-cover" />
									{caption ? (
										<figcaption className="mt-1 font-sans text-xs text-stone-muted">{caption}</figcaption>
									) : null}
								</figure>
								<p className="mt-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand-dark">
									{i + 1} · {a.category}
								</p>
								<h2 className="mt-1 font-display text-2xl leading-snug text-navy group-hover:underline">{a.title}</h2>
								<p className="mt-2 font-sans text-base text-stone-muted">{a.dek}</p>
								<p className="mt-2 font-sans text-sm font-semibold text-navy">Read the full story →</p>
							</Link>
						</article>
					))}
				</div>

				<aside aria-label="Advertisement" className="mt-14 border border-navy/40 bg-white p-5">
					<p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-muted">
						Advertisement · Our sponsors
					</p>
					<div className="mt-4 grid gap-6 sm:grid-cols-3">
						{SPONSORS.map((s) => (
							<a
								key={s.name}
								href={s.href}
								target="_blank"
								rel="sponsored noopener"
								className="group block"
							>
								<p className="font-display text-lg text-navy group-hover:underline">{s.name}</p>
								<p className="mt-1 font-sans text-sm text-stone-muted">{s.text}</p>
								<p className="mt-1 font-sans text-xs font-semibold text-navy">{s.label}</p>
							</a>
						))}
					</div>
				</aside>

				<p className="mt-10 text-center font-sans text-sm text-stone-muted">
					Questions or tips: The Porch newsroom,{' '}
					<a href={phone.href} className="font-semibold text-navy underline">
						{phone.display}
					</a>
					.{' '}
					<Link href={`${base}/archive`} className="font-semibold text-navy underline">
						Every story in {ed.name} →
					</Link>
				</p>
				<p className="mt-6 text-center font-sans text-xs text-stone-muted">
					Photos: Lake Tradition at twilight by Serge Yatunin, CC BY-SA 4.0; Port St. Lucie City Hall by Birbie28, CC BY-SA
					4.0; both via Wikimedia Commons. Illustrations: {ed.name}.
				</p>
				<p className="mt-2 text-center font-sans text-xs text-stone-muted">{ed.sponsor}</p>
			</div>
		</section>
	)
}
