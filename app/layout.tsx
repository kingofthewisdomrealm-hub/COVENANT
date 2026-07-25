import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'

import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { siteConfig } from '@/content/site'

import './globals.css'

const display = Fraunces({
	subsets: ['latin'],
	variable: '--font-display',
	display: 'swap',
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
		default: `${siteConfig.name}: Florida Residential & Commercial Builder`,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteUrl,
		siteName: siteConfig.name,
		title: `${siteConfig.name}: Florida Residential & Commercial Builder`,
		description: siteConfig.description,
		images: [
			{
				url: '/images/intro.webp',
				width: 984,
				height: 656,
				alt: 'Covenant Builders construction craftsmanship',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: `${siteConfig.name}: Florida Residential & Commercial Builder`,
		description: siteConfig.description,
		images: ['/images/intro.webp'],
	},
	icons: {
		icon: '/favicon.png',
	},
	alternates: {
		canonical: '/',
	},
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
			</body>
		</html>
	)
}
