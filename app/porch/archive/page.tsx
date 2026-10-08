import type { Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { PORCH_NAME, PORCH_TAGLINE } from '@/content/porch'
import { siteConfig } from '@/content/site'
import { PORCH_CATEGORIES, formatPorchDate, getPublishedPorchArticles } from '@/lib/porch-articles'

export const metadata: Metadata = {
	title: { absolute: `All articles | ${PORCH_NAME} — Vero Beach homeowner news` },
	description:
		'Every Vero Porch article: Vero Beach and Indian River County news for homeowners — utility bills, property taxes, septic and sewer, permits, storms, condos and local history.',
	alternates: { canonical: '/porch/archive', types: { 'application/rss+xml': '/porch/feed.xml' } },
}

export default function PorchArchivePage() {
	const articles = getPublishedPorchArticles()
	const groups = PORCH_CATEGORIES.map((c) => ({ c, items: articles.filter((a) => a.category === c) })).filter(
		(g) => g.items.length,
	)

	const itemList = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${PORCH_NAME} — all articles`,
		url: `${siteConfig.url}/porch/archive`,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: articles.map((a, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `${siteConfig.url}/porch/${a.slug}`,
				name: a.title,
			})),
		},
	}

	return (
		<>
			<BreadcrumbJsonLd
				crumbs={[
					{ name: PORCH_NAME, path: '/porch' },
					{ name: 'All articles', path: '/porch/archive' },
				]}
			/>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
			<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
				<div className="section-shell max-w-4xl">
					<header className="border-y-4 border-double border-navy py-5 text-center">
						<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-muted">
							<Link href="/porch" className="hover:text-navy">
								{PORCH_NAME}
							</Link>
						</p>
						<h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-navy">All articles</h1>
						<p className="mt-2 font-display text-lg italic text-sand-dark">{PORCH_TAGLINE}</p>
					</header>

					{groups.length === 0 ? (
						<p className="mt-10 body-copy">The first articles are on their way.</p>
					) : (
						<nav aria-label="Topics" className="mt-6 flex flex-wrap gap-2">
							{groups.map((g) => (
								<a
									key={g.c}
									href={`#${g.c.toLowerCase().replace(/[^a-z]+/g, '-')}`}
									className="border border-navy/20 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-navy hover:border-sand"
								>
									{g.c} ({g.items.length})
								</a>
							))}
						</nav>
					)}

					{groups.map((g) => (
						<section
							key={g.c}
							id={g.c.toLowerCase().replace(/[^a-z]+/g, '-')}
							aria-label={g.c}
							className="mt-12 scroll-mt-28"
						>
							<h2 className="eyebrow">{g.c}</h2>
							<ul className="mt-3 divide-y divide-navy/10 border-y border-navy/10">
								{g.items.map((a) => (
									<li key={a.slug} className="py-4">
										<Link href={`/porch/${a.slug}`} className="group block">
											<p className="font-sans text-xs text-stone-muted">{formatPorchDate(a.publishedAt)}</p>
											<p className="mt-1 font-display text-xl text-navy group-hover:underline">{a.title}</p>
											<p className="mt-1 font-sans text-sm text-stone-muted">{a.dek}</p>
										</Link>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</section>
		</>
	)
}
