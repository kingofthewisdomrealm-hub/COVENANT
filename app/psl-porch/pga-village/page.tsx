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
	const [lead, ...rest] = stories

	const Eyebrow = ({ children }: { children: React.ReactNode }) => (
		<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-sand-dark">{children}</p>
	)
	const Picture = ({ img, alt, caption, ratio }: { img: string; alt: string; caption?: string; ratio: string }) => (
		<figure>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={img}
				alt={alt}
				className={`${ratio} w-full bg-[#efe7d6] ${img.endsWith('.svg') ? 'object-contain' : 'object-cover'}`}
			/>
			{caption ? <figcaption className="mt-2 font-display text-sm italic text-stone-muted">{caption}</figcaption> : null}
		</figure>
	)

	return (
		<section className="bg-[#FBFAF6] pb-24 pt-12 sm:pt-16">
			<div className="mx-auto w-full max-w-[1520px] px-5 sm:px-10 lg:px-16">
				{/* Masthead */}
				<header className="text-center">
					<div className="flex items-center justify-between font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-muted">
						<span>November 2026</span>
						<span className="hidden sm:inline">Lobby Edition</span>
						<span>Free</span>
					</div>
					<div className="mt-4 border-t border-navy" />
					<div className="mt-[3px] border-t border-navy" />
					<div className="py-8 sm:py-10">
						{ed.logo ? (
							<div className="mb-3 flex justify-center">
								<Link href={base} aria-label={ed.name}>
									<EditionLogo ed={ed} width={88} />
								</Link>
							</div>
						) : null}
						<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-muted">
							<Link href={base} className="hover:text-navy">
								{ed.name}
							</Link>
						</p>
						<h1 className="mt-3 font-display text-6xl font-semibold tracking-tight text-navy sm:text-7xl lg:text-8xl">
							PGA Village
						</h1>
						<p className="mt-3 font-display text-xl italic text-sand-dark">{ed.tagline}</p>
					</div>
					<div className="border-t border-navy" />
					<div className="mt-[3px] border-t border-navy" />
				</header>

				{/* Lead story + right rail */}
				<div className="mt-14 grid gap-14 lg:grid-cols-12">
					{lead ? (
						<article id="story-1" className="scroll-mt-28 lg:col-span-8">
							<Link href={`${base}/${lead.a.slug}`} className="group block">
								<Picture img={lead.img} alt={lead.alt} caption={lead.caption} ratio="aspect-[16/8]" />
								<div className="mt-8 max-w-3xl">
									<Eyebrow>{lead.a.category}</Eyebrow>
									<h2 className="mt-3 font-display text-4xl leading-[1.12] tracking-tight text-navy group-hover:underline sm:text-5xl">
										{lead.a.title}
									</h2>
									<p className="mt-5 font-display text-xl italic leading-relaxed text-ink/75">{lead.a.dek}</p>
									<p className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy">Read the story →</p>
								</div>
							</Link>
						</article>
					) : null}

					<aside className="lg:col-span-4 lg:border-l lg:border-navy/15 lg:pl-12">
						<Eyebrow>In this edition</Eyebrow>
						<p className="mt-4 font-display text-lg leading-relaxed text-navy">
							Four stories picked for PGA Village homeowners, from the tax breaks that must be filed by March 1 to the
							projects that need a city permit.
						</p>
						<ol className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
							{stories.map(({ a }, i) => (
								<li key={a.slug}>
									<a href={`#story-${i + 1}`} className="group flex gap-5 py-5">
										<span className="font-display text-4xl leading-none text-sand-dark">{i + 1}</span>
										<span>
											<span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-muted">
												{a.category}
											</span>
											<span className="mt-1 block font-display text-lg leading-snug text-navy group-hover:underline">
												{a.title}
											</span>
										</span>
									</a>
								</li>
							))}
						</ol>
						<div className="mt-10">
							<Eyebrow>The Porch newsroom</Eyebrow>
							<p className="mt-3 font-sans text-sm leading-relaxed text-stone-muted">
								Questions, tips or corrections? Call or text{' '}
								<a href={phone.href} className="font-semibold text-navy underline underline-offset-4">
									{phone.display}
								</a>
								.
							</p>
							<p className="mt-4 flex gap-6 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
								<a href="/porch/pga-village/psl-porch-pga-village-lobby-edition.pdf" className="hover:underline">
									Print edition
								</a>
								<Link href={`${base}/archive`} className="hover:underline">
									Every story
								</Link>
							</p>
						</div>
					</aside>
				</div>

				{/* The other three stories, broadsheet columns */}
				<div className="mt-20 border-t border-navy pt-12">
					<div className="grid gap-14 md:-mx-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-navy/15">
						{rest.map(({ a, img, alt, caption }, i) => (
							<article
								key={a.slug}
								id={`story-${i + 2}`}
								className="scroll-mt-28 md:px-10"
							>
								<Link href={`${base}/${a.slug}`} className="group block">
									<Picture img={img} alt={alt} caption={caption} ratio="aspect-[4/3]" />
									<div className="mt-6">
										<Eyebrow>{a.category}</Eyebrow>
										<h2 className="mt-3 font-display text-2xl leading-snug text-navy group-hover:underline lg:text-3xl">
											{a.title}
										</h2>
										<p className="mt-4 font-sans text-base leading-relaxed text-stone-muted">{a.dek}</p>
										<p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy">
											Read the story →
										</p>
									</div>
								</Link>
							</article>
						))}
					</div>
				</div>

				{/* Sponsors */}
				<aside aria-label="Advertisement" className="mt-24 bg-[#F3EEE3] px-6 py-12 sm:px-12">
					<p className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-muted">
						Advertisement · Our sponsors
					</p>
					<div className="mx-auto mt-10 grid max-w-6xl gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-navy/15">
						{SPONSORS.map((s) => (
							<a
								key={s.name}
								href={s.href}
								target="_blank"
								rel="sponsored noopener"
								className="group block text-center md:px-10"
							>
								<p className="font-display text-2xl text-navy group-hover:underline">{s.name}</p>
								<p className="mx-auto mt-3 max-w-xs font-display text-base italic leading-relaxed text-ink/70">{s.text}</p>
								<p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-navy">{s.label}</p>
							</a>
						))}
					</div>
				</aside>

				<footer className="mt-14 text-center font-sans text-xs leading-relaxed text-stone-muted">
					<p>
						Photos: Lake Tradition at twilight by Serge Yatunin, CC BY-SA 4.0; Port St. Lucie City Hall by Birbie28, CC BY-SA 4.0;
						both via Wikimedia Commons. Illustrations: {ed.name}.
					</p>
					<p className="mt-2">{ed.sponsor}</p>
				</footer>
			</div>
		</section>
	)
}
