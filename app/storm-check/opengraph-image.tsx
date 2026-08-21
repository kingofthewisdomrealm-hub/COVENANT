import { ImageResponse } from 'next/og'

import { siteConfig } from '@/content/site'

/**
 * Share card for the project designer.
 *
 * This exists as a FILE rather than as `metadata.openGraph.images` because
 * Next.js gives file-based metadata precedence: declaring `openGraph` on the
 * page silently dropped the inherited root image, and re-declaring `images` in
 * the metadata object did not bring it back. A route-level image file is the
 * supported way to do this — and it lets the card carry the actual offer
 * instead of the generic company blurb, which matters because the site's root
 * URL now resolves here, so this is the card people see whenever anyone shares
 * covenantbuilders.org.
 */

export const alt =
	'Was your roof hit? The 60-second storm check — Covenant Builders'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function StormCheckOgImage() {
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
						Was your roof hit? Find out in 60 seconds.
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
						Enter your ZIP, answer six quick questions, and get a written
						answer from a licensed Florida contractor — free, no obligation.
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
					<span>covenantbuilders.org</span>
				</div>
			</div>
		),
		{ ...size }
	)
}
