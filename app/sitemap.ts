import type { MetadataRoute } from 'next'

import { siteConfig } from '@/content/site'

export default function sitemap(): MetadataRoute.Sitemap {
	const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url
	// '/' is intentionally absent: it redirects to /design-your-project, and a
	// sitemap should not list URLs that redirect.
	const routes = [
		'/design-your-project',
		'/services',
		'/portfolio',
		'/about',
		'/contact',
		'/homeowner-programs',
		'/privacy',
	]

	const entries = routes.map((route) => ({
		url: `${base}${route}`,
		lastModified: new Date(),
		changeFrequency:
			route === '/design-your-project'
				? ('weekly' as const)
				: ('monthly' as const),
		priority: route === '/design-your-project' ? 1 : 0.7,
	}))

	// Investors page exists but is noindex; omit from public sitemap priority list
	return entries
}
