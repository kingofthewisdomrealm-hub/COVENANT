import { ImageResponse } from 'next/og'

import { siteConfig } from '@/content/site'

/**
 * Share card for the build-order game.
 *
 * Same reason as /storm-check and /design-your-project: this page declares its
 * own `openGraph` block, which drops the inherited root image, and re-declaring
 * `images` in the metadata object does not bring it back. A route-level image
 * file is the supported fix, and it lets the card carry the invitation rather
 * than the generic company blurb.
 */

export const alt =
	'Roof Raiser — build a Florida house in the right order — Covenant Builders'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function PlayOgImage() {
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
				<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
					<div
						style={{
							fontSize: 26,
							letterSpacing: 4,
							textTransform: 'uppercase',
							color: '#C4A574',
						}}
					>
						{siteConfig.name}
					</div>
					<div
						style={{
							fontSize: 66,
							lineHeight: 1.08,
							maxWidth: 940,
							fontWeight: 600,
						}}
					>
						Can you build a house in the right order?
					</div>
					<div
						style={{
							fontSize: 27,
							color: '#D9D2C5',
							maxWidth: 880,
							lineHeight: 1.35,
							fontFamily: 'system-ui, sans-serif',
						}}
					>
						Roof Raiser puts a Florida block house and roof in your hands, one
						step at a time — real inspection order, zero jargon. Free to play.
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
					<span>
						{siteConfig.license.number} · Licensed since{' '}
						{siteConfig.license.licensedYear}
					</span>
					<span>covenantbuilders.org/play</span>
				</div>
			</div>
		),
		{ ...size }
	)
}
