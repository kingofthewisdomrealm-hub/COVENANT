import { ImageResponse } from 'next/og'

import { PORCH_NAME } from '@/content/porch'
import { formatPorchDate, getPorchArticle, getPublishedPorchArticles } from '@/lib/porch-articles'

export const alt = 'The Vero Porch — neighborhood news for Vero Beach'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
	return getPublishedPorchArticles().map((a) => ({ slug: a.slug }))
}

/** Newspaper-style share card for each article. */
export default function PorchArticleOgImage({ params }: { params: { slug: string } }) {
	const a = getPorchArticle(params.slug)
	const title = a?.title ?? PORCH_NAME
	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '60px 72px',
					background: '#FBFAF6',
					color: '#12182B',
					fontFamily: 'Georgia, serif',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							fontFamily: 'system-ui, sans-serif',
							fontSize: 22,
							letterSpacing: 3,
							textTransform: 'uppercase',
							color: '#8f7a57',
							borderBottom: '4px solid #12182B',
							paddingBottom: 14,
						}}
					>
						<span>{PORCH_NAME}</span>
						<span>{a ? `${a.category} · ${formatPorchDate(a.publishedAt)}` : 'Vero Beach'}</span>
					</div>
					<div style={{ fontSize: title.length > 80 ? 54 : 64, lineHeight: 1.08, fontWeight: 700, marginTop: 30 }}>
						{title}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						fontFamily: 'system-ui, sans-serif',
						fontSize: 22,
						color: '#4a5166',
					}}
				>
					<span>Neighborhood news for Vero Beach</span>
					<span>covenantbuilders.org/porch</span>
				</div>
			</div>
		),
		{ ...size },
	)
}
