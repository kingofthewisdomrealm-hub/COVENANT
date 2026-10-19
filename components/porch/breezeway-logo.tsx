/**
 * The Breezeway logo — a Florida mid-rise condo seen from the parking lot:
 * a flat roof with a parapet, three floors of open-air breezeway (the outdoor
 * corridor every Florida condo has) with railings and posts, unit doors along
 * each breezeway, the stair tower at the end, and a palm out front. Plain SVG
 * so it works in the masthead and in next/og share images (colors passed in).
 */
export function BreezewayLogoSvg({
	width = 120,
	ink = '#12182B',
	accent = '#C4A574',
	title = 'The Breezeway',
}: {
	width?: number
	ink?: string
	accent?: string
	title?: string
}) {
	const height = Math.round((width * 100) / 120)
	const floors = [20, 44, 68] // top of each breezeway level
	const doors = [28, 42, 56, 70]
	const posts = [24, 38, 52, 66, 80]
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 100"
			role="img"
			aria-label={`${title} logo: a condo building with open-air breezeways`}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* roof + parapet */}
			<rect x="14" y="8" width="84" height="3.5" fill={ink} />
			<rect x="14" y="11.5" width="84" height="1.3" fill={accent} />
			{/* stair tower */}
			<rect x="86" y="4" width="14" height="88" fill="none" stroke={ink} strokeWidth="1.8" />
			<line x1="88" y1="30" x2="98" y2="20" stroke={accent} strokeWidth="1.2" />
			<line x1="88" y1="54" x2="98" y2="44" stroke={accent} strokeWidth="1.2" />
			<line x1="88" y1="78" x2="98" y2="68" stroke={accent} strokeWidth="1.2" />
			{/* building end wall */}
			<rect x="14" y="12.8" width="2" height="79.2" fill={ink} />
			{floors.map((y) => (
				<g key={y}>
					{/* doors along the breezeway */}
					{doors.map((x) => (
						<g key={x}>
							<rect x={x} y={y - 4} width="6" height="13" fill="none" stroke={ink} strokeWidth="1.2" />
							<circle cx={x + 4.8} cy={y + 3} r="0.7" fill={ink} />
						</g>
					))}
					{/* slab edge */}
					<rect x="14" y={y + 9} width="72" height="2.6" fill={ink} />
					{/* railing */}
					<rect x="18" y={y + 3} width="68" height="1.3" fill={ink} />
					{Array.from({ length: 17 }, (_, i) => (
						<rect key={i} x={19.5 + i * 4} y={y + 4.3} width="0.9" height="4.7" fill={ink} />
					))}
					{/* posts */}
					{posts.map((x) => (
						<rect key={x} x={x} y={y - 8} width="1.8" height="17" fill={ink} />
					))}
					<rect x="16" y={y - 8} width="70" height="1" fill={accent} />
				</g>
			))}
			{/* ground floor */}
			<rect x="14" y="80.6" width="72" height="11.4" fill="none" stroke={ink} strokeWidth="1.2" />
			{/* palm */}
			<path d="M8 96 C9 84 9 74 10 64" stroke={ink} strokeWidth="2" fill="none" />
			<path d="M10 64 C4 60 1 62 0 66 M10 64 C6 58 8 54 12 54 M10 64 C14 58 19 59 20 62 M10 64 C16 63 18 67 17 70 M10 64 C5 65 3 69 4 72" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
			{/* ground */}
			<rect x="0" y="92" width="120" height="1.8" fill={ink} />
		</svg>
	)
}
