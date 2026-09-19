import type { services } from '@/content/site'
import { siteConfig } from '@/content/site'

type Service = (typeof services)[number]

/**
 * Service-level structured data for a /services/[slug] detail page.
 *
 * Separate from the Organization's `hasOfferCatalog` in components/json-ld.tsx
 * (which lists every service briefly on every page) — this is the fuller,
 * page-specific Service entity for the one page actually about this service,
 * linked back to the same Organization @id so both point at one entity graph.
 */
export function ServiceJsonLd({
	service,
	path,
}: {
	service: Service
	path: string
}) {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': `${siteConfig.url}${path}#service`,
		name: service.title,
		description: service.description,
		serviceType: service.title,
		url: `${siteConfig.url}${path}`,
		provider: {
			'@id': `${siteConfig.url}/#organization`,
		},
		areaServed: siteConfig.serviceCities.map((city) => ({
			'@type': 'City',
			name: city,
		})),
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: `${service.title} — what this includes`,
			itemListElement: service.bullets.map((bullet) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					name: bullet,
				},
			})),
		},
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
