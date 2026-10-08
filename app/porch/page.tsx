import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import Link from 'next/link'

import { PorchReportCardBox } from '@/components/porch-report-card-box'
import {
	PORCH_NAME,
	PORCH_SPONSOR,
	PORCH_TAGLINE,
	currentPorchIssue as issue,
	type PorchStory,
} from '@/content/porch'
import { siteConfig } from '@/content/site'
import { formatPorchDate, getPublishedPorchArticles } from '@/lib/porch-articles'

export const metadata: Metadata = {
	title: `${PORCH_NAME} — ${issue.monthLabel}`,
	description: `${PORCH_TAGLINE}. Why your water and sewer bill went up, the septic deadline, Amendment 3 forums, parking fines, storm-season checks and what is on around town.`,
	alternates: { canonical: '/porch', types: { 'application/rss+xml': '/porch/feed.xml' } },
	openGraph: {
		title: `${PORCH_NAME} — ${issue.monthLabel}`,
		description: PORCH_TAGLINE,
		url: '/porch',
		type: 'article',
	},
}

/**
 * The full online edition of The Vero Porch. The printed front page's QR code
 * lands here. Content lives in content/porch.ts — read the rules at the top
 * of that file before editing copy.
 */
export default function PorchPage() {
	return (
		<>
			<BreadcrumbJsonLd crumbs={[{ name: PORCH_NAME, path: '/porch' }]} />
			<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
				<div className="section-shell max-w-4xl">
					{/* Masthead */}
					<header className="border-y-4 border-double border-navy py-5 text-center">
						<div className="flex flex-wrap items-center justify-between gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-muted">
							<span>
								Vol. {issue.volume}, No. {issue.number}
							</span>
							<span>{issue.monthLabel}</span>
							<span>{issue.price}</span>
						</div>
						<h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-navy sm:text-7xl">
							{PORCH_NAME}
						</h1>
						<p className="mt-2 font-display text-lg italic text-sand-dark sm:text-xl">
							{PORCH_TAGLINE}
						</p>
					</header>

					<p className="mt-4 text-center font-sans text-xs text-stone-muted">
						Full edition · Facts checked {formatDate(issue.checkedOn)}
					</p>

					{/* Lead story */}
					<Story story={issue.lead} lead />

					{/* News briefs */}
					<section aria-labelledby="briefs-title" className="mt-14 border-t-4 border-double border-navy pt-8">
						<h2 id="briefs-title" className="eyebrow">
							Also this month
						</h2>
						<div className="mt-5 grid gap-8 sm:grid-cols-2">
							{issue.briefs.map((b) => (
								<article key={b.slug} aria-labelledby={`brief-${b.slug}`}>
									<p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand-dark">
										{b.kicker}
									</p>
									<h3 id={`brief-${b.slug}`} className="mt-1 font-display text-2xl leading-snug text-navy">
										{b.headline}
									</h3>
									<p className="mt-2 body-copy text-ink/85">{b.body}</p>
								</article>
							))}
						</div>
					</section>

					<div className="mt-14 border-t border-navy/15 pt-12">
						<Story story={issue.storm} />
					</div>

					<div className="mt-14 grid gap-12 border-t border-navy/15 pt-12 md:grid-cols-[1.4fr_1fr]">
						<Story story={issue.history} />
						<aside aria-labelledby="around-town">
							<p className="eyebrow">Around town</p>
							<h2 id="around-town" className="mt-2 font-display text-3xl text-navy">
								What&rsquo;s on
							</h2>
							<ul className="mt-5 divide-y divide-navy/10 border-y border-navy/10">
								{issue.events.map((e) => (
									<li key={e.when + e.what} className="py-3">
										<p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand-dark">
											{e.when}
										</p>
										<p className="mt-1 font-display text-lg leading-snug text-navy">{e.what}</p>
										<p className="font-sans text-sm text-stone-muted">{e.where}</p>
									</li>
								))}
							</ul>
							<p className="mt-3 font-sans text-xs text-stone-muted">
								Dates come from the organizers&rsquo; published calendars. Check before you go.
							</p>
						</aside>
					</div>

					<div className="mt-14 border-t border-navy/15 pt-12">
						<Story story={issue.askTheBuilder} />
					</div>

					{/* The one Covenant box */}
					<PorchReportCardBox className="mt-16" />

					{/* Latest articles */}
					<LatestArticles />

					{/* Send us your news */}
					<section className="mt-12 border border-navy/15 p-6 text-center">
						<h2 className="font-display text-2xl text-navy">Got neighborhood news?</h2>
						<p className="mx-auto mt-2 max-w-xl body-copy">
							A new neighbor, a street cleanup, a birthday on the block, a question about your house.
							Text it to {siteConfig.phones.sr.display} and it may make the next issue.
						</p>
					</section>

					<footer className="mt-12 border-t border-navy/15 pt-6 font-sans text-xs leading-relaxed text-stone-muted">
						<p>{PORCH_SPONSOR}.</p>
						<p className="mt-3 font-semibold uppercase tracking-[0.14em]">Sources</p>
						<ul className="mt-1 space-y-1">
							{issue.sources.map((s) => (
								<li key={s.url}>
									<a className="underline hover:text-navy" href={s.url} rel="noopener" target="_blank">
										{s.label}
									</a>
								</li>
							))}
						</ul>
					</footer>
				</div>
			</section>
		</>
	)
}

function Story({ story, lead = false }: { story: PorchStory; lead?: boolean }) {
	return (
		<article className={lead ? 'mt-10' : ''} aria-labelledby={`story-${story.slug}`}>
			<p className="eyebrow">{story.kicker}</p>
			<h2
				id={`story-${story.slug}`}
				className={`mt-2 font-display tracking-tight text-navy ${
					lead ? 'text-4xl sm:text-5xl' : 'text-3xl'
				}`}
				style={{ textWrap: 'balance' }}
			>
				{story.headline}
			</h2>
			<p className="mt-3 font-display text-xl italic leading-snug text-stone-muted">{story.dek}</p>
			<div className="mt-5 max-w-3xl space-y-4">
				{story.paragraphs.map((p) => (
					<p key={p.slice(0, 32)} className="body-copy text-ink/85">
						{p}
					</p>
				))}
			</div>
			{story.list ? (
				<ol className="mt-6 grid gap-4 sm:grid-cols-2">
					{story.list.map((item, i) => (
						<li key={item.title} className="border-l-2 border-sand pl-4">
							<p className="font-display text-lg text-navy">
								<span className="mr-2 text-sand-dark">{i + 1}.</span>
								{item.title}
							</p>
							<p className="mt-1 font-sans text-base leading-relaxed text-stone-muted">{item.body}</p>
						</li>
					))}
				</ol>
			) : null}
		</article>
	)
}

function formatDate(iso: string) {
	return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

function LatestArticles() {
	const latest = getPublishedPorchArticles().slice(0, 8)
	if (!latest.length) return null
	return (
		<section aria-labelledby="latest-title" className="mt-14">
			<p className="eyebrow">Every day on the Porch</p>
			<h2 id="latest-title" className="mt-2 font-display text-3xl text-navy">
				Latest articles
			</h2>
			<ul className="mt-5 divide-y divide-navy/10 border-y border-navy/10">
				{latest.map((a) => (
					<li key={a.slug} className="py-4">
						<Link href={`/porch/${a.slug}`} className="group block">
							<p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand-dark">
								{a.category} · {formatPorchDate(a.publishedAt)}
							</p>
							<p className="mt-1 font-display text-xl text-navy group-hover:underline">{a.title}</p>
							<p className="mt-1 font-sans text-sm text-stone-muted">{a.dek}</p>
						</Link>
					</li>
				))}
			</ul>
			<p className="mt-4">
				<Link href="/porch/archive" className="link-underline">
					All articles
				</Link>
			</p>
		</section>
	)
}
