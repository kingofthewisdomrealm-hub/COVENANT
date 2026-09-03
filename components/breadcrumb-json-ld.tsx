import { siteConfig } from '@/content/site'

interface Crumb {
	name: string
	/** Site-relative path, e.g. '/services'. */
	path: string
}

/**
 * BreadcrumbList structured data for an inner page.
 *
 * This site is one level deep, so every trail is Home > This Page. It is worth
 * emitting anyway: it is what lets Google print "covenantbuilders.org > Services"
 * in place of a raw URL, and it gives each page an explicit statement of where
 * it sits rather than leaving that to be inferred.
 *
 * The first crumb points at the site root, which currently 307s to the project
 * designer (see next.config.mjs). That is fine — Google resolves the redirect —
 * and pointing it anywhere else would misstate the hierarchy.
 */
export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ name: 'Home', path: '/' },
			...crumbs,
		].map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: `${siteConfig.url}${crumb.path === '/' ? '' : crumb.path}`,
		})),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
