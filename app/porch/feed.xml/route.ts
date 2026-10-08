import { PORCH_NAME, PORCH_TAGLINE } from '@/content/porch'
import { siteConfig } from '@/content/site'
import { getPublishedPorchArticles } from '@/lib/porch-articles'

export const dynamic = 'force-static'

function esc(s: string) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** RSS 2.0 feed of every published Vero Porch article. */
export function GET() {
	const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url
	const items = getPublishedPorchArticles()
		.slice(0, 50)
		.map((a) => {
			const url = `${base}/porch/${a.slug}`
			return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(
				`${a.publishedAt}T11:00:00Z`,
			).toUTCString()}</pubDate><category>${esc(a.category)}</category><description>${esc(a.description)}</description></item>`
		})
		.join('')
	const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(
		PORCH_NAME,
	)}</title><link>${base}/porch</link><atom:link href="${base}/porch/feed.xml" rel="self" type="application/rss+xml"/><description>${esc(
		PORCH_TAGLINE,
	)} — published by ${esc(siteConfig.name)}</description><language>en-us</language>${items}</channel></rss>`
	return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
