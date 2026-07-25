import type { MetadataRoute } from 'next'

import { siteConfig } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
	const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url

	return {
		rules: {
			userAgent: '*',
			allow: '/',
		},
		sitemap: `${base}/sitemap.xml`,
	}
}
