import fs from 'node:fs'
import path from 'node:path'

/**
 * The Porch papers — daily articles, one folder per edition.
 *
 * The Vero Porch:      content/porch-articles/            → /porch/<slug>
 * The Sebastian Porch: content/sebastian-porch-articles/  → /sebastian-porch/<slug>
 * The PSL Porch:       content/psl-porch-articles/        → /psl-porch/<slug>
 *
 * One JSON file per article, named `YYYY-MM-DD--<slug>.json`. Read at build
 * time; every article is a static page. Rules for writing one are in each
 * folder's README.md — run `npm run porch:check` before pushing.
 */

export type PorchEditionKey = 'vero' | 'sebastian' | 'psl'

const EDITION_DIRS: Record<PorchEditionKey, string> = {
	vero: 'porch-articles',
	sebastian: 'sebastian-porch-articles',
	psl: 'psl-porch-articles',
}

export const PORCH_CATEGORIES = [
	'Bills & utilities',
	'Taxes & money',
	'Storms & safety',
	'Permits & rules',
	'Home care',
	'Condos & HOAs',
	'Around town',
	'Vero history',
	'Sebastian history',
	'PSL history',
] as const
export type PorchCategory = (typeof PORCH_CATEGORIES)[number]

export type PorchBlock =
	| { type: 'p'; text: string }
	| { type: 'h2'; text: string }
	| { type: 'ul'; items: string[] }
	| { type: 'ol'; items: string[] }
	| { type: 'callout'; title: string; text: string }

export interface PorchArticle {
	slug: string
	/** The on-page H1. */
	title: string
	/** <title> tag; ≤ 60 characters. Falls back to title. */
	seoTitle?: string
	/** Meta description; 120–160 characters. */
	description: string
	/** One-sentence summary shown under the headline. */
	dek: string
	category: PorchCategory
	/** ISO date, America/New_York, e.g. 2026-10-08 */
	publishedAt: string
	updatedAt?: string
	/** Places the article is about, e.g. "Vero Beach", "Indian River County". */
	places: string[]
	keywords: string[]
	body: PorchBlock[]
	faq?: { q: string; a: string }[]
	sources: { label: string; url: string }[]
}

const FILE_RE = /^(\d{4}-\d{2}-\d{2})--([a-z0-9-]+)\.json$/

const cache: Partial<Record<PorchEditionKey, PorchArticle[]>> = {}

export function getAllPorchArticles(edition: PorchEditionKey = 'vero'): PorchArticle[] {
	const cached = cache[edition]
	if (cached) return cached
	const DIR = path.join(process.cwd(), 'content', EDITION_DIRS[edition])
	const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => FILE_RE.test(f)) : []
	const articles = files.map((f) => {
		const raw = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as PorchArticle
		return raw
	})
	// Newest first; same day → filename order reversed so later additions lead.
	articles.sort((a, b) =>
		a.publishedAt === b.publishedAt ? b.slug.localeCompare(a.slug) : b.publishedAt.localeCompare(a.publishedAt),
	)
	cache[edition] = articles
	return articles
}

/** Articles whose publish date has arrived (America/New_York). Future-dated files stay hidden. */
export function getPublishedPorchArticles(edition: PorchEditionKey = 'vero', now = new Date()): PorchArticle[] {
	const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now)
	return getAllPorchArticles(edition).filter((a) => a.publishedAt <= today)
}

export function getPorchArticle(slug: string, edition: PorchEditionKey = 'vero'): PorchArticle | undefined {
	return getPublishedPorchArticles(edition).find((a) => a.slug === slug)
}

export function getRelatedPorchArticles(
	article: PorchArticle,
	count = 3,
	edition: PorchEditionKey = 'vero',
): PorchArticle[] {
	const others = getPublishedPorchArticles(edition).filter((a) => a.slug !== article.slug)
	const same = others.filter((a) => a.category === article.category)
	const rest = others.filter((a) => a.category !== article.category)
	return [...same, ...rest].slice(0, count)
}

export function porchReadingMinutes(article: PorchArticle): number {
	const words = article.body
		.map((b) => (b.type === 'ul' || b.type === 'ol' ? b.items.join(' ') : b.type === 'callout' ? `${b.title} ${b.text}` : b.text))
		.join(' ')
		.split(/\s+/).length
	return Math.max(1, Math.round(words / 230))
}

export function formatPorchDate(iso: string): string {
	return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}
