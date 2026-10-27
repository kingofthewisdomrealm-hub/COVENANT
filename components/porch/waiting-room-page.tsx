import type { Metadata } from 'next'
import Link from 'next/link'

import { EditionLogo } from '@/components/porch/edition-logo'
import { siteConfig } from '@/content/site'
import {
	WAITING_ROOM_EDITIONS,
	WAITING_ROOM_KEYS,
	WAITING_ROOM_SPECIALTIES,
	type WaitingRoomKey,
	type WaitingRoomPaper,
} from '@/content/waiting-room-editions'
import { getPublishedPorchArticles, type PorchArticle } from '@/lib/porch-articles'
import type { PorchEdition } from '@/lib/porch-editions'

export function waitingRoomParams() {
	return WAITING_ROOM_KEYS.map((specialty) => ({ specialty }))
}

function isKey(s: string): s is WaitingRoomKey {
	return (WAITING_ROOM_KEYS as string[]).includes(s)
}

/** The edition's articles that are published today, in the order listed. */
export function waitingRoomArticles(ed: PorchEdition, specialty: WaitingRoomKey): PorchArticle[] {
	const published = getPublishedPorchArticles(ed.key)
	return WAITING_ROOM_EDITIONS[ed.key as WaitingRoomPaper][specialty].slugs
		.map((slug) => published.find((a) => a.slug === slug))
		.filter((a): a is PorchArticle => Boolean(a))
}

export function waitingRoomMetadata(ed: PorchEdition, specialty: string): Metadata {
	if (!isKey(specialty)) return {}
	const label = WAITING_ROOM_SPECIALTIES[specialty].label
	return {
		title: { absolute: `${ed.name} · Waiting Room Edition: ${label}` },
		description: WAITING_ROOM_EDITIONS[ed.key as WaitingRoomPaper][specialty].intro.slice(0, 158),
		alternates: { canonical: `${ed.basePath}/waiting-room/${specialty}` },
	}
}

export function WaitingRoomView({ edition: ed, specialty }: { edition: PorchEdition; specialty: string }) {
	if (!isKey(specialty)) return null
	const spec = WAITING_ROOM_SPECIALTIES[specialty]
	const edition = WAITING_ROOM_EDITIONS[ed.key as WaitingRoomPaper][specialty]
	const articles = waitingRoomArticles(ed, specialty)
	const base = ed.basePath
	const phone = siteConfig.phones.porch

	return (
		<section className="bg-[#FBFAF6] pb-20 pt-10 sm:pt-14">
			<div className="section-shell max-w-3xl">
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
						· Waiting Room Edition
					</p>
					<h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
						{spec.label}
					</h1>
					<p className="mt-2 font-display text-lg italic text-sand-dark">{ed.tagline}</p>
				</header>

				<p className="mt-8 font-display text-xl leading-relaxed text-navy">{edition.intro}</p>

				<ol className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
					{articles.map((a, i) => (
						<li key={a.slug} className="py-6">
							<Link href={`${base}/${a.slug}`} className="group block">
								<p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand-dark">
									{i + 1} · {a.category}
								</p>
								<p className="mt-1 font-display text-2xl text-navy group-hover:underline">{a.title}</p>
								<p className="mt-2 font-sans text-base text-stone-muted">{a.dek}</p>
								<p className="mt-2 font-sans text-sm font-semibold text-navy">Read the full story →</p>
							</Link>
						</li>
					))}
				</ol>

				<div className="mt-10 border border-navy/15 bg-white p-5">
					<p className="eyebrow">Copies for your waiting room</p>
					<p className="mt-2 font-sans text-sm text-stone-muted">
						Free printed copies are available for {spec.offices} in our area. Call or text the Porch newsroom at{' '}
						<a href={phone.href} className="font-semibold text-navy underline">
							{phone.display}
						</a>
						.
					</p>
				</div>

				<p className="mt-8 text-center font-sans text-sm">
					<Link href={`${base}/archive`} className="font-semibold text-navy underline">
						Every story in {ed.name} →
					</Link>
				</p>
				<p className="mt-6 text-center font-sans text-xs text-stone-muted">{ed.sponsor}</p>
			</div>
		</section>
	)
}
