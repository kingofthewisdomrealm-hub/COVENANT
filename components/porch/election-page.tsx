import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { porchAboutPath } from '@/components/porch/about-page'
import { Block } from '@/components/porch/article-page'
import { getLiveElectionEdition, type ElectionEdition } from '@/content/election-2026'
import { siteConfig } from '@/content/site'
import { formatPorchDate } from '@/lib/porch-articles'
import type { PorchEdition } from '@/lib/porch-editions'

/** The Porch — Election Edition. One page per paper, content in content/election-2026.ts. */

export function electionPath(ed: PorchEdition) {
	return `${ed.basePath}/election-2026`
}

export function porchElectionMetadata(ed: PorchEdition): Metadata {
	const e = getLiveElectionEdition(ed.key)
	if (!e) return { robots: { index: false } }
	const path = electionPath(ed)
	return {
		title: { absolute: `${e.seoTitle} | ${ed.name}` },
		description: e.description,
		alternates: { canonical: path },
		openGraph: { type: 'article', title: e.seoTitle, description: e.description, url: path, siteName: ed.name, publishedTime: `${e.liveFrom}T07:00:00-04:00` },
		twitter: { card: 'summary_large_image', title: e.seoTitle, description: e.description },
	}
}

export function PorchElectionView({ edition: ed }: { edition: PorchEdition }) {
	const e = getLiveElectionEdition(ed.key)
	if (!e) notFound()
	const path = electionPath(ed)
	return (
		<>
			<BreadcrumbJsonLd
				crumbs={[
					{ name: ed.name, path: ed.basePath },
					{ name: 'Election Edition', path },
				]}
			/>
			<ElectionJsonLd e={e} ed={ed} />
			<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
				<div className="section-shell max-w-3xl">
					<nav aria-label="Breadcrumb" className="font-sans text-xs text-stone-muted">
						<Link href={ed.basePath} className="font-semibold uppercase tracking-[0.16em] text-navy hover:text-sand-dark">
							{ed.name}
						</Link>
						<span className="mx-2">/</span>
						<span>Election Edition</span>
					</nav>

					<article className="mt-6" aria-labelledby="election-title">
						<header className="border-b border-navy/15 pb-6">
							<p className="eyebrow">Election Edition · Nov. 3, 2026</p>
							<h1 id="election-title" className="mt-2 font-display text-4xl tracking-tight text-navy sm:text-5xl" style={{ textWrap: 'balance' }}>
								{e.title}
							</h1>
							<p className="mt-4 font-display text-xl italic leading-snug text-stone-muted">{e.dek}</p>
							<p className="mt-4 font-sans text-sm text-stone-muted">
								By{' '}
								<Link href={porchAboutPath(ed)} className="font-semibold text-navy hover:underline">
									{ed.name} staff
								</Link>{' '}
								· <time dateTime={e.liveFrom}>{formatPorchDate(e.liveFrom)}</time> · Facts checked{' '}
								<time dateTime={e.checkedOn}>{formatPorchDate(e.checkedOn)}</time>
							</p>
							<p className="mt-3 border-l-4 border-sand bg-white p-3 font-sans text-sm text-ink/85">
								This guide gives facts, dates and where to learn more. It does not tell you how to vote, and candidates are
								listed in ballot or alphabetical order.
							</p>
						</header>

						<div className="mt-8 space-y-5">
							{e.body.map((block, i) => (
								<Block key={i} block={block} />
							))}
						</div>

						<section aria-labelledby="faq-title" className="mt-12 border-t border-navy/15 pt-8">
							<h2 id="faq-title" className="font-display text-3xl text-navy">
								Common questions
							</h2>
							<dl className="mt-5 space-y-5">
								{e.faq.map((f) => (
									<div key={f.q}>
										<dt className="font-display text-xl text-navy">{f.q}</dt>
										<dd className="mt-1 body-copy text-ink/85">{f.a}</dd>
									</div>
								))}
							</dl>
						</section>

						<footer className="mt-12 border-t border-navy/15 pt-6 font-sans text-sm text-stone-muted">
							<p className="font-semibold uppercase tracking-[0.14em] text-xs">Sources</p>
							<ul className="mt-2 space-y-1">
								{e.sources.map((s) => (
									<li key={s.url}>
										<a className="underline hover:text-navy" href={s.url} rel="noopener" target="_blank">
											{s.label}
										</a>
									</li>
								))}
							</ul>
							<p className="mt-4 text-xs leading-relaxed">
								{ed.name} is owned, published and paid for by {siteConfig.name}. Spot a mistake? Text{' '}
								<a className="underline hover:text-navy" href={siteConfig.phones.porch.href}>
									{siteConfig.phones.porch.display}
								</a>
								. Questions about voting go to the Indian River County Supervisor of Elections, 772-226-4700.
							</p>
							<p className="mt-2 text-xs">
								<Link href={porchAboutPath(ed)} className="underline hover:text-navy">
									About &amp; standards
								</Link>
								<span className="mx-2">·</span>
								<Link href={`${porchAboutPath(ed)}#corrections`} className="underline hover:text-navy">
									Corrections policy
								</Link>
							</p>
						</footer>
					</article>
				</div>
			</section>
		</>
	)
}

/** Front-page banner pointing to the election edition while it is current. */
export function ElectionBanner({ edition: ed }: { edition: PorchEdition }) {
	const e = getLiveElectionEdition(ed.key)
	if (!e) return null
	const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date())
	if (today > e.bannerUntil) return null
	return (
		<Link href={electionPath(ed)} className="mt-6 block border-2 border-navy bg-white p-4 text-center hover:bg-navy/5">
			<span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sand-dark">Election Edition · Nov. 3</span>
			<span className="mt-1 block font-display text-2xl text-navy">Your ballot, item by item, and where to vote →</span>
		</Link>
	)
}

function ElectionJsonLd({ e, ed }: { e: ElectionEdition; ed: PorchEdition }) {
	const url = `${siteConfig.url}${electionPath(ed)}`
	const data = {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		'@id': `${url}#article`,
		mainEntityOfPage: url,
		headline: e.seoTitle,
		description: e.description,
		datePublished: `${e.liveFrom}T07:00:00-04:00`,
		dateModified: `${e.checkedOn > e.liveFrom ? e.checkedOn : e.liveFrom}T07:00:00-04:00`,
		articleSection: 'Election',
		inLanguage: 'en-US',
		isAccessibleForFree: true,
		author: { '@type': 'Organization', name: ed.name, url: `${siteConfig.url}${ed.basePath}` },
		publisher: { '@id': `${siteConfig.url}/#organization` },
		publishingPrinciples: `${siteConfig.url}${porchAboutPath(ed)}#standards`,
		citation: e.sources.map((s) => s.url),
	}
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
