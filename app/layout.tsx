import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'

import { SiteAnalytics } from '@/components/analytics'
import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { siteConfig } from '@/content/site'

import './globals.css'

const display = Fraunces({
	subsets: ['latin'],
	variable: '--font-display',
	display: 'swap',
	axes: ['SOFT', 'WONK', 'opsz'],
})

const sans = Source_Sans_3({
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap',
})

const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default:
			'Custom Home Builder in Vero Beach & the Treasure Coast | Covenant Builders',
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteUrl,
		siteName: siteConfig.name,
		title:
			'Custom Home Builder in Vero Beach & the Treasure Coast | Covenant Builders',
		description: siteConfig.description,
	},
	twitter: {
		card: 'summary_large_image',
		title:
			'Custom Home Builder in Vero Beach & the Treasure Coast | Covenant Builders',
		description: siteConfig.description,
	},
	icons: {
		icon: '/favicon.png',
	},
	alternates: {
		canonical: '/',
	},
	...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
		? {
				verification: {
					google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
				},
			}
		: {}),
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${display.variable} ${sans.variable} antialiased`}>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-sand focus:px-4 focus:py-2 focus:text-navy"
				>
					Skip to content
				</a>
				<JsonLd />
				<SiteHeader />
				<main id="main-content">{children}</main>
				<SiteFooter />
				<SiteAnalytics />
			</body>
		</html>
	)
}
