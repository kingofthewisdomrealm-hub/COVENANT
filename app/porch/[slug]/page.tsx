import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { PorchReportCardBox } from '@/components/porch-report-card-box'
import { PORCH_NAME } from '@/content/porch'
import { siteConfig } from '@/content/site'
import {
	formatPorchDate,
	getPorchArticle,
	getPublishedPorchArticles,
	getRelatedPorchArticles,
	porchReadingMinutes,
	type PorchArticle,
	type PorchBlock,
} from '@/lib/porch-articles'

interface PageProps {
	params: { slug: string }
}

export const dynamicParams = false

export function generateStaticParams() {
	return getPublishedPorchArticles().map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
	const a = getPorchArticle(params.slug)
	if (!a) return {}
	const title = a.seoTitle ?? a.title
	return {
		title: { absolute: `${title} | ${PORCH_NAME}` },
		description: a.description,
		keywords: a.keywords,
		alternates: {
			canonical: `/porch/${a.slug}`,
			types: { 'application/rss+xml': '/porch/feed.xml' },
		},
		openGraph: {
			type: 'article',
			title,
			description: a.description,
			url: `/porch/${a.slug}`,
			siteName: PORCH_NAME,
			publishedTime: `${a.publishedAt}T07:00:00-04:00`,
			modifiedTime: `${a.updatedAt ?? a.publishedAt}T07:00:00-04:00`,
			section: a.category,
			tags: a.keywords,
		},
		twitter: { card: 'summary_large_image', title, description: a.description },
	}
}

export default function PorchArticlePage({ params }: PageProps) {
	const a = getPorchArticle(params.slug)
	if (!a) notFound()
	const related = getRelatedPorchArticles(a)
	const minutes = porchReadingMinutes(a)

	return (
		<>
			<BreadcrumbJsonLd
				crumbs={[
					{ name: PORCH_NAME, path: '/porch' },
					{ name: a.title, path: `/porch/${a.slug}` },
				]}
			/>
			<ArticleJsonLd article={a} />
			{a.faq?.length ? <FaqJsonLd faq={a.faq} /> : null}

			<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
				<div className="section-shell max-w-3xl">
					<nav aria-label="Breadcrumb" className="font-sans text-xs text-stone-muted">
						<Link href="/porch" className="font-semibold uppercase tracking-[0.16em] text-navy hover:text-sand-dark">
							{PORCH_NAME}
						</Link>
						<span className="mx-2">/</span>
						<Link href="/porch/archive" className="hover:text-navy">
							{a.category}
						</Link>
					</nav>

					<article className="mt-6" aria-labelledby="article-title">
						<header className="border-b border-navy/15 pb-6">
							<p className="eyebrow">{a.category}</p>
							<h1
								id="article-title"
								className="mt-2 font-display text-4xl tracking-tight text-navy sm:text-5xl"
								style={{ textWrap: 'balance' }}
							>
								{a.title}
							</h1>
							<p className="mt-4 font-display text-xl italic leading-snug text-stone-muted">{a.dek}</p>
							<p className="mt-4 font-sans text-sm text-stone-muted">
								<time dateTime={a.publishedAt}>{formatPorchDate(a.publishedAt)}</time>
								{a.updatedAt && a.updatedAt !== a.publishedAt ? (
									<>
										{' '}
										· Updated <time dateTime={a.updatedAt}>{formatPorchDate(a.updatedAt)}</time>
									</>
								) : null}
								{' '}· {minutes} min read · {a.places.join(', ')}
							</p>
						</header>

						<div className="mt-8 space-y-5">
							{a.body.map((block, i) => (
								<Block key={i} block={block} />
							))}
						</div>

						{a.faq?.length ? (
							<section aria-labelledby="faq-title" className="mt-12 border-t border-navy/15 pt-8">
								<h2 id="faq-title" className="font-display text-3xl text-navy">
									Common questions
								</h2>
								<dl className="mt-5 space-y-5">
									{a.faq.map((f) => (
										<div key={f.q}>
											<dt className="font-display text-xl text-navy">{f.q}</dt>
											<dd className="mt-1 body-copy text-ink/85">{f.a}</dd>
										</div>
									))}
								</dl>
							</section>
						) : null}

						<footer className="mt-12 border-t border-navy/15 pt-6 font-sans text-sm text-stone-muted">
							<p className="font-semibold uppercase tracking-[0.14em] text-xs">Sources</p>
							<ul className="mt-2 space-y-1">
								{a.sources.map((s) => (
									<li key={s.url}>
										<a className="underline hover:text-navy" href={s.url} rel="noopener" target="_blank">
											{s.label}
										</a>
									</li>
								))}
							</ul>
							<p className="mt-4 text-xs leading-relaxed">
								{PORCH_NAME} is published by {siteConfig.name}, {siteConfig.address.full}. Facts are
								checked against the sources above on the date shown. Spot something out of date? Text{' '}
								{siteConfig.phones.sr.display}.
							</p>
						</footer>
					</article>

					<PorchReportCardBox className="mt-14" />

					{related.length ? (
						<section aria-labelledby="related-title" className="mt-14">
							<h2 id="related-title" className="eyebrow">
								More from the Porch
							</h2>
							<ul className="mt-4 divide-y divide-navy/10 border-y border-navy/10">
								{related.map((r) => (
									<li key={r.slug} className="py-4">
										<Link href={`/porch/${r.slug}`} className="group block">
											<p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand-dark">
												{r.category} · {formatPorchDate(r.publishedAt)}
											</p>
											<p className="mt-1 font-display text-xl text-navy group-hover:underline">{r.title}</p>
										</Link>
									</li>
								))}
							</ul>
							<p className="mt-4">
								<Link href="/porch/archive" className="link-underline">
									Every article
								</Link>
							</p>
						</section>
					) : null}
				</div>
			</section>
		</>
	)
}

function Block({ block }: { block: PorchBlock }) {
	switch (block.type) {
		case 'h2':
			return <h2 className="pt-4 font-display text-3xl tracking-tight text-navy">{block.text}</h2>
		case 'ul':
			return (
				<ul className="list-disc space-y-2 pl-6 body-copy text-ink/85">
					{block.items.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>
			)
		case 'ol':
			return (
				<ol className="list-decimal space-y-2 pl-6 body-copy text-ink/85">
					{block.items.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ol>
			)
		case 'callout':
			return (
				<aside className="border-l-4 border-sand bg-white p-5">
					<p className="font-display text-xl text-navy">{block.title}</p>
					<p className="mt-2 body-copy text-ink/85">{block.text}</p>
				</aside>
			)
		default:
			return <p className="body-copy text-ink/85">{block.text}</p>
	}
}

function ArticleJsonLd({ article: a }: { article: PorchArticle }) {
	const url = `${siteConfig.url}/porch/${a.slug}`
	const data = {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		'@id': `${url}#article`,
		mainEntityOfPage: url,
		headline: (a.seoTitle ?? a.title).slice(0, 110),
		description: a.description,
		image: [`${url}/opengraph-image`],
		datePublished: `${a.publishedAt}T07:00:00-04:00`,
		dateModified: `${a.updatedAt ?? a.publishedAt}T07:00:00-04:00`,
		articleSection: a.category,
		keywords: a.keywords.join(', '),
		inLanguage: 'en-US',
		isAccessibleForFree: true,
		contentLocation: a.places.map((p) => ({ '@type': 'Place', name: `${p}, Florida` })),
		author: {
			'@type': 'Organization',
			name: PORCH_NAME,
			url: `${siteConfig.url}/porch`,
		},
		publisher: { '@id': `${siteConfig.url}/#organization` },
		isPartOf: {
			'@type': 'Periodical',
			name: PORCH_NAME,
			url: `${siteConfig.url}/porch`,
		},
		citation: a.sources.map((s) => s.url),
	}
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

function FaqJsonLd({ faq }: { faq: { q: string; a: string }[] }) {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a },
		})),
	}
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
