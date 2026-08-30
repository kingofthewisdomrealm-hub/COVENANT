import { services, siteConfig } from '@/content/site'

export function JsonLd() {
	const data = {
		'@context': 'https://schema.org',
		'@type': ['GeneralContractor', 'LocalBusiness'],
		'@id': `${siteConfig.url}/#organization`,
		name: siteConfig.name,
		alternateName: siteConfig.license.dba,
		url: siteConfig.url,
		email: siteConfig.emails.info,
		telephone: siteConfig.phones.sr.display,
		description: siteConfig.description,
		image: `${siteConfig.url}/images/logo.png`,
		logo: `${siteConfig.url}/images/logo.png`,
		priceRange: '$$',
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
			latitude: 27.6386,
			longitude: -80.3973,
		},
		areaServed: siteConfig.serviceCities.map((city) => ({
			'@type': 'City',
			name: city,
			containedInPlace: {
				'@type': 'AdministrativeArea',
				name: 'Florida',
			},
		})),
		/*
		 * sameAs is how Google ties these profiles to this business. Only
		 * verified, active profiles belong here — see content/site.ts.
		 */
		sameAs: [
			...siteConfig.social.map((profile) => profile.href),
			siteConfig.address.mapsUrl,
			siteConfig.license.dbprLookupUrl,
		],
		knowsAbout: [
			...services.map((service) => service.title),
			'Vero Beach custom home builder',
			'Treasure Coast construction',
			`Florida contractor ${siteConfig.license.number}`,
		],
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Construction services',
			itemListElement: services.map((service) => ({
				'@type': 'Offer',
				itemOffered: {
					'@type': 'Service',
					name: service.title,
					description: service.summary,
					areaServed: siteConfig.serviceArea,
					provider: {
						'@id': `${siteConfig.url}/#organization`,
					},
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
