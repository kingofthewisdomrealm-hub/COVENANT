import { ImageResponse } from 'next/og'

import { formatPorchDate, getPorchArticle } from '@/lib/porch-articles'
import type { PorchEdition } from '@/lib/porch-editions'
import { PorchLogoSvg } from '@/components/porch/porch-logo'

export const porchOgSize = { width: 1200, height: 630 }

/** Newspaper-style share card for each article. */
export function porchOgImage(ed: PorchEdition, slug: string) {
	const PORCH_NAME = ed.name
	const size = porchOgSize
	const a = getPorchArticle(slug, ed.key)
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
						<span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
							{ed.logo === 'porch' ? <PorchLogoSvg width={54} /> : null}
							{PORCH_NAME}
						</span>
						<span>{a ? `${a.category} · ${formatPorchDate(a.publishedAt)}` : ed.town}</span>
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
					<span>{ed.tagline}</span>
					<span>covenantbuilders.org{ed.basePath}</span>
				</div>
			</div>
		),
		{ ...size },
	)
}
