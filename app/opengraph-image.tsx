import { ImageResponse } from 'next/og'

import { siteConfig } from '@/content/site'

export const alt = 'Covenant Builders — Florida residential and commercial builder'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '72px',
					background:
						'linear-gradient(145deg, #12182B 0%, #1c2744 55%, #2a3348 100%)',
					color: '#F7F1E8',
					fontFamily: 'Georgia, serif',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
					}}
				>
					<div
						style={{
							fontSize: 28,
							letterSpacing: 4,
							textTransform: 'uppercase',
							color: '#C4A574',
						}}
					>
						{siteConfig.name}
					</div>
					<div
						style={{
							fontSize: 64,
							lineHeight: 1.1,
							maxWidth: 900,
							fontWeight: 600,
						}}
					>
						Florida residential & commercial builder
					</div>
					<div
						style={{
							fontSize: 28,
							color: '#D9D2C5',
							maxWidth: 820,
							fontFamily: 'system-ui, sans-serif',
						}}
					>
						{siteConfig.serviceArea}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						fontFamily: 'system-ui, sans-serif',
						fontSize: 22,
						color: '#C4A574',
					}}
				>
					<span>CBC1253676 · Licensed since 2005</span>
					<span>covenantbuilders.org</span>
				</div>
			</div>
		),
		{ ...size },
	)
}
