import type { Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld'
import { siteConfig } from '@/content/site'
import type { PorchEdition } from '@/lib/porch-editions'

/**
 * "About & standards" page for each Porch paper: who owns and pays for it,
 * who writes it, the rules it follows, the corrections policy, and how to
 * reach the editor. Trust raters (NewsGuard, the Trust Project) and search
 * engines look for exactly these things, so keep them plain and current.
 */

export const PORCH_EDITOR = 'Josias Andujar Sr.'

export function porchAboutPath(ed: PorchEdition) {
	return `${ed.basePath}/about`
}

export function porchAboutMetadata(ed: PorchEdition): Metadata {
	const path = porchAboutPath(ed)
	const description = `Who publishes and pays for ${ed.name}, how we report, how we label sponsors, how we correct mistakes, and how to reach the editor.`
	return {
		title: { absolute: `About & standards | ${ed.name}` },
		description,
		alternates: { canonical: path },
		openGraph: { type: 'website', title: `About ${ed.name}`, description, url: path, siteName: ed.name },
	}
}

export function PorchAboutView({ edition: ed }: { edition: PorchEdition }) {
	const paper = ed.name
	const nick = ed.nickname ?? 'the Porch'
	const phone = siteConfig.phones.sr
	const email = siteConfig.emails.info
	const path = porchAboutPath(ed)

	return (
		<>
			<BreadcrumbJsonLd
				crumbs={[
					{ name: paper, path: ed.basePath },
					{ name: 'About & standards', path },
				]}
			/>
			<AboutJsonLd edition={ed} />

			<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
				<div className="section-shell max-w-3xl">
					<nav aria-label="Breadcrumb" className="font-sans text-xs text-stone-muted">
						<Link href={ed.basePath} className="font-semibold uppercase tracking-[0.16em] text-navy hover:text-sand-dark">
							{paper}
						</Link>
						<span className="mx-2">/</span>
						<span>About &amp; standards</span>
					</nav>

					<article className="mt-6" aria-labelledby="about-title">
						<header className="border-b border-navy/15 pb-6">
							<p className="eyebrow">About us</p>
							<h1 id="about-title" className="mt-2 font-display text-4xl tracking-tight text-navy sm:text-5xl">
								About {paper}
							</h1>
							<p className="mt-4 font-display text-xl italic leading-snug text-stone-muted">
								Free, plain-English news for {ed.town}. Here is who is behind it, who pays for it, and the rules
								we follow.
							</p>
						</header>

						<div className="mt-8 space-y-5">
							<h2 id="ownership" className="pt-4 font-display text-3xl tracking-tight text-navy">
								Who owns and pays for {nick}
							</h2>
							<p className="body-copy text-ink/85">
								{paper} is owned, published and paid for by {siteConfig.name}, a Florida{' '}
								{siteConfig.license.classification.toLowerCase()} (license {siteConfig.license.number}) at{' '}
								{siteConfig.address.full}. {siteConfig.name} is also the paper&rsquo;s sponsor. No one else pays for
								it, and it is free to read.
							</p>
							<p className="body-copy text-ink/85">
								Because a construction company publishes this paper, we hold ourselves to a simple rule: the
								articles never sell. {siteConfig.name} appears in one clearly marked sponsor box on each page, and
								nowhere in the articles themselves.
							</p>

							<h2 id="who-writes-it" className="pt-4 font-display text-3xl tracking-tight text-navy">
								Who writes it
							</h2>
							<p className="body-copy text-ink/85">
								Articles carry the byline &ldquo;{paper} staff.&rdquo; {PORCH_EDITOR}, president of{' '}
								{siteConfig.name}, is responsible for what we publish. Every article lists the sources it is
								based on: city and county records, state agencies, and local news outlets, checked on the date
								shown.
							</p>

							<h2 id="standards" className="pt-4 font-display text-3xl tracking-tight text-navy">
								Our standards
							</h2>
							<ul className="list-disc space-y-2 pl-6 body-copy text-ink/85">
								<li>
									<strong>Every fact has a source.</strong> If we can&rsquo;t verify a number, date or name, we
									leave it out.
								</li>
								<li>
									<strong>News, not opinion.</strong> Articles explain what is happening and what you can do. On
									elections and ballot measures we give facts, dates and where to learn more, never how to vote.
								</li>
								<li>
									<strong>Money never buys coverage.</strong> No one can pay to be written about, to change a
									story, or to keep one out. Community features are free and are chosen for what a group does for
									its neighbors.
								</li>
								<li>
									<strong>Paid is always labeled.</strong> The sponsor box is marked as a sponsor. Any paid
									content would carry an &ldquo;Ad&rdquo; or &ldquo;Sponsored&rdquo; label above it.
								</li>
								<li>
									<strong>No gifts.</strong> We don&rsquo;t accept gifts, tickets or favors from people or groups
									we cover.
								</li>
								<li>
									<strong>No insurance-claim talk.</strong> We never encourage anyone to file or handle an
									insurance claim, and we never offer rebates or &ldquo;free roof&rdquo; deals (Florida Statute
									489.147).
								</li>
							</ul>

							<h2 id="corrections" className="pt-4 font-display text-3xl tracking-tight text-navy">
								Corrections policy
							</h2>
							<p className="body-copy text-ink/85">
								We fix mistakes quickly and in the open. When we correct a fact, we change the article, show an
								&ldquo;Updated&rdquo; date under the headline, and add a dated correction note at the end saying
								what was wrong. We don&rsquo;t quietly delete errors. Small fixes to spelling or formatting that
								don&rsquo;t change any fact are made without a note.
							</p>

							<h2 id="contact" className="pt-4 font-display text-3xl tracking-tight text-navy">
								Send a correction, a tip or a question
							</h2>
							<p className="body-copy text-ink/85">
								Spot something wrong or out of date? Have a story idea, or news from your street? Reach the editor
								directly:
							</p>
							<ul className="list-disc space-y-2 pl-6 body-copy text-ink/85">
								<li>
									Text or call{' '}
									<a className="underline hover:text-navy" href={phone.href}>
										{phone.display}
									</a>
								</li>
								<li>
									Email{' '}
									<a className="underline hover:text-navy" href={`mailto:${email}?subject=${encodeURIComponent(`${paper}: correction or tip`)}`}>
										{email}
									</a>{' '}
									with &ldquo;{paper}&rdquo; in the subject line
								</li>
							</ul>
							<p className="body-copy text-ink/85">
								Tell us which article and what you think is wrong, and a link to a source if you have one. We
								read every message. We never print your name without asking.
							</p>
						</div>

						<footer className="mt-12 border-t border-navy/15 pt-6 font-sans text-sm text-stone-muted">
							<Link href={ed.basePath} className="link-underline">
								Back to {paper}
							</Link>
							<span className="mx-2">·</span>
							<Link href={`${ed.basePath}/archive`} className="link-underline">
								Every article
							</Link>
						</footer>
					</article>
				</div>
			</section>
		</>
	)
}

function AboutJsonLd({ edition: ed }: { edition: PorchEdition }) {
	const about = `${siteConfig.url}${porchAboutPath(ed)}`
	const data = {
		'@context': 'https://schema.org',
		'@type': 'NewsMediaOrganization',
		'@id': `${siteConfig.url}${ed.basePath}#paper`,
		name: ed.name,
		url: `${siteConfig.url}${ed.basePath}`,
		parentOrganization: { '@id': `${siteConfig.url}/#organization`, name: siteConfig.name },
		publishingPrinciples: `${about}#standards`,
		correctionsPolicy: `${about}#corrections`,
		ownershipFundingInfo: `${about}#ownership`,
		masthead: `${about}#who-writes-it`,
		actionableFeedbackPolicy: `${about}#contact`,
		email: siteConfig.emails.info,
		telephone: siteConfig.phones.sr.display,
	}
	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
