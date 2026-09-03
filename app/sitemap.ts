import type { MetadataRoute } from 'next'

import { siteConfig } from '@/content/site'

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

export default function sitemap(): MetadataRoute.Sitemap {
	const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url

	// Investors page exists but is noindex; deliberately omitted.
	return routes.map((route) => ({
		url: `${base}${route.path}`,
		lastModified: new Date(`${route.lastModified}T12:00:00Z`),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}))
}
