import { siteConfig } from '@/content/site'

export function JsonLd() {
	const data = {
		'@context': 'https://schema.org',
		'@type': 'GeneralContractor',
		name: siteConfig.name,
		url: siteConfig.url,
		email: siteConfig.emails.info,
		telephone: siteConfig.phones.sr.display,
		description: siteConfig.description,
		image: `${siteConfig.url}/images/logo.png`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: siteConfig.address.street,
			addressLocality: siteConfig.address.city,
			addressRegion: siteConfig.address.state,
			postalCode: siteConfig.address.zip,
			addressCountry: 'US',
		},
		areaServed: siteConfig.serviceArea,
		founder: {
			'@type': 'Person',
			name: siteConfig.phones.sr.name,
		},
		hasCredential: {
			'@type': 'EducationalOccupationalCredential',
			credentialCategory: siteConfig.license.classification,
			identifier: siteConfig.license.number,
			recognizedBy: {
				'@type': 'Organization',
				name: 'Florida Department of Business and Professional Regulation',
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
