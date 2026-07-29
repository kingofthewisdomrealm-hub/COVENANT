import { services, siteConfig } from '@/content/site'

export function JsonLd() {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'GeneralContractor',
		'@id': `${siteConfig.url}/#organization`,
		name: siteConfig.name,
		alternateName: siteConfig.license.dba,
		url: siteConfig.url,
		email: siteConfig.emails.info,
		telephone: siteConfig.phones.sr.display,
		description: siteConfig.description,
		image: `${siteConfig.url}/images/logo.png`,
		logo: `${siteConfig.url}/images/logo.png`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: siteConfig.address.street,
			addressLocality: siteConfig.address.city,
			addressRegion: siteConfig.address.state,
			postalCode: siteConfig.address.zip,
			addressCountry: 'US',
		},
		geo: {
			'@type': 'GeoCoordinates',
			addressCountry: 'US',
			addressRegion: 'FL',
			addressLocality: siteConfig.address.city,
		},
		areaServed: {
			'@type': 'Place',
			name: siteConfig.serviceArea,
		},
		sameAs: [siteConfig.address.mapsUrl],
		knowsAbout: services.map((service) => service.title),
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Construction services',
			itemListElement: services.map((service) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					name: service.title,
					description: service.summary,
				},
			})),
		},
		founder: {
			'@type': 'Person',
			name: siteConfig.phones.sr.name,
			jobTitle: siteConfig.phones.sr.role,
			telephone: siteConfig.phones.sr.display,
			email: siteConfig.emails.josias,
		},
		hasCredential: {
			'@type': 'EducationalOccupationalCredential',
			credentialCategory: siteConfig.license.classification,
			identifier: siteConfig.license.number,
			recognizedBy: {
				'@type': 'Organization',
				name: 'Florida Department of Business and Professional Regulation',
				url: siteConfig.license.dbprLookupUrl,
			},
		},
		openingHoursSpecification: siteConfig.hours
			.filter((item) => item.time !== 'Closed')
			.map((item) => ({
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: item.day,
				opens: '09:00',
				closes: '17:00',
			})),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
