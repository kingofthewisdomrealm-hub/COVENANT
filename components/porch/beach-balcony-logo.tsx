/**
 * The Miami Balcony logo — an actual balcony: arched French doors with a
 * transom bar, a railing of twelve balusters, the slab, and the bracket under
 * it in sea teal. The same drawing as the printed front page. Plain SVG so it
 * works in the masthead and in next/og share images (no Tailwind classes
 * inside; colors are passed in).
 */
export function BeachBalconyLogoSvg({
	width = 120,
	ink = '#12182B',
	accent = '#1F6F78',
	glass = '#DCEBED',
	title = 'The Miami Balcony',
}: {
	width?: number
	ink?: string
	accent?: string
	glass?: string
	title?: string
}) {
	const balusters = [16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104]
	return (
		<svg
			width={width}
			height={width}
			viewBox="0 0 120 120"
			role="img"
			aria-label={`${title} logo: a balcony`}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M34 80 V36 A26 26 0 0 1 86 36 V80 Z" fill={glass} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
			<line x1="60" y1="10" x2="60" y2="80" stroke={ink} strokeWidth="3" />
			<line x1="34" y1="38" x2="86" y2="38" stroke={ink} strokeWidth="3" />
			<rect x="12" y="50" width="96" height="5" rx="2.5" fill={ink} />
			{balusters.map((x) => (
				<rect key={x} x={x} y="55" width="3" height="25" fill={ink} />
			))}
			<rect x="8" y="80" width="104" height="8" rx="4" fill={ink} />
			<path d="M22 88 H98 L90 98 H30 Z" fill={accent} />
		</svg>
	)
}
