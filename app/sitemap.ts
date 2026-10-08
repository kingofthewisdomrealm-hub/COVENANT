import type { MetadataRoute } from 'next'

import { communityCities } from '@/content/community'
import { getPublishedPorchArticles } from '@/lib/porch-articles'
import { services, siteConfig } from '@/content/site'

/**
 * ⚠️ When you meaningfully change a page, bump its `lastModified` below.
 *
 * This used to be `new Date()` for every route, which told Google that every
 * page on the site had changed today — on every single fetch. A lastmod that
 * is always "now" is indistinguishable from no lastmod at all, and Google
 * learns to ignore it, which costs us the one signal that says "this page is
 * genuinely new, come look". Real dates are worth the small maintenance cost.
 *
 * Dates below are the real last substantive change to each page, taken from
 * git history. Typo fixes and invisible markup don't count — only changes a
 * visitor would notice.
 */
const routes: {
	path: string
	lastModified: string
	changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
	priority: number
}[] = [
	// '/' is intentionally absent: it redirects to /design-your-project, and a
	// sitemap should not list URLs that redirect.
	{
		path: '/design-your-project',
		lastModified: '2026-08-20',
		changeFrequency: 'weekly',
		priority: 1,
	},
	{
		path: '/homeowner-programs',
		lastModified: '2026-09-03',
		changeFrequency: 'monthly',
		priority: 0.9,
	},
	{
		path: '/services',
		lastModified: '2026-09-03',
		changeFrequency: 'monthly',
		priority: 0.9,
	},
	{
		path: '/storm-check',
		lastModified: '2026-08-21',
		changeFrequency: 'monthly',
		priority: 0.8,
	},
	{
		path: '/portfolio',
		lastModified: '2026-08-28',
		changeFrequency: 'monthly',
		priority: 0.7,
	},
	{
		path: '/about',
		lastModified: '2026-08-28',
		changeFrequency: 'monthly',
		priority: 0.7,
	},
	{
		path: '/contact',
		lastModified: '2026-08-28',
		changeFrequency: 'monthly',
		priority: 0.7,
	},
	{
		path: '/careers',
		lastModified: '2026-09-23',
		changeFrequency: 'monthly',
		priority: 0.5,
	},
	{
		path: '/play',
		lastModified: '2026-08-21',
		changeFrequency: 'monthly',
		priority: 0.5,
	},
	{
		path: '/privacy',
		lastModified: '2026-08-20',
		changeFrequency: 'yearly',
		priority: 0.3,
	},
]

/**
 * Standalone /services/[slug] detail pages, generated from `services` itself
 * so a future 6th service can't ship without also appearing here. Added
 * 2026-09-19 so each service can target its own search phrase instead of
 * sharing one /services URL. See docs/services-page-plan.md.
 */
const serviceDetailRoutes: typeof routes = services.map((service) => ({
	path: `/services/${service.seoSlug}`,
	lastModified: '2026-09-19',
	changeFrequency: 'monthly',
	priority: 0.85,
}))

/**
 * /community/[slug] — community-first resource pages, one per service city.
 * Only cities with genuine, verified local content belong in
 * content/community.ts; see that file's header comment before adding one.
 */
const communityRoutes: typeof routes = communityCities.map((city) => ({
	path: `/community/${city.slug}`,
	lastModified: city.verifiedAsOf,
	changeFrequency: 'monthly',
	priority: 0.6,
}))

/**
 * /porch/[slug] — The Vero Porch daily articles, plus the archive. Dates come
 * from each article file, so a new article updates the sitemap by itself.
 */
function porchRoutes(): typeof routes {
	const articles = getPublishedPorchArticles()
	const newest = articles[0]?.publishedAt ?? '2026-10-08'
	return [
		{ path: '/porch', lastModified: newest, changeFrequency: 'daily', priority: 0.7 },
		{ path: '/porch/archive', lastModified: newest, changeFrequency: 'daily', priority: 0.5 },
		...articles.map((a) => ({
			path: `/porch/${a.slug}`,
			lastModified: a.updatedAt ?? a.publishedAt,
			changeFrequency: 'monthly' as const,
			priority: 0.6,
		})),
	]
}

export default function sitemap(): MetadataRoute.Sitemap {
	const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url

	// Investors page exists but is noindex; deliberately omitted.
	return [...routes, ...serviceDetailRoutes, ...communityRoutes, ...porchRoutes()].map((route) => ({
		url: `${base}${route.path}`,
		lastModified: new Date(`${route.lastModified}T12:00:00Z`),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}))
}
