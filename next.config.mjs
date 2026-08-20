/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ['image/webp', 'image/avif'],
	},
	/**
	 * The root URL is the campaign landing page: it sends visitors straight to
	 * the project designer.
	 *
	 * DELIBERATELY TEMPORARY (307), not permanent (308). A permanent redirect is
	 * cached hard by browsers and treated by search engines as "the root URL has
	 * moved for good", which is painful to walk back if this does not convert.
	 * Keep it temporary until the designer has beaten the old homepage on real
	 * numbers; only then consider making it permanent.
	 *
	 * Note the SEO trade-off this accepts: the root URL is normally the
	 * strongest page on a site for local search ("Vero Beach contractor"), and a
	 * redirect means it is no longer a page with content of its own. Watch
	 * organic traffic after this ships.
	 */
	async redirects() {
		return [
			{
				source: '/',
				destination: '/design-your-project',
				permanent: false,
			},
		]
	},
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
				],
			},
		]
	},
}

export default nextConfig
