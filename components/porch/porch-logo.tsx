/**
 * The PSL Porch logo — an actual front porch: gable roof, four posts, a
 * railing on each side, the front door with its lamp, and three steps down
 * to the walk. Plain SVG so it works in the masthead and in next/og share
 * images (no Tailwind classes inside; colors are passed in).
 */
export function PorchLogoSvg({
	width = 120,
	ink = '#12182B',
	accent = '#C4A574',
	title = 'The PSL Porch',
}: {
	width?: number
	ink?: string
	accent?: string
	title?: string
}) {
	const height = Math.round((width * 100) / 120)
	const leftBalusters = [21, 26, 31, 36, 41]
	const rightBalusters = [79, 84, 89, 94, 99]
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 100"
			role="img"
			aria-label={`${title} logo: a front porch`}
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Roof: gable with overhang, plus a sand trim line */}
			<polygon points="4,38 60,7 116,38" fill={ink} />
			<polyline points="14,35 60,12 106,35" fill="none" stroke={accent} strokeWidth="1.6" />
			{/* Round gable vent */}
			<circle cx="60" cy="26" r="3.2" fill="none" stroke={accent} strokeWidth="1.4" />
			{/* Beam */}
			<rect x="10" y="38" width="100" height="5" fill={ink} />
			{/* Posts */}
			<rect x="14" y="43" width="5" height="35" fill={ink} />
			<rect x="43" y="43" width="5" height="35" fill={ink} />
			<rect x="72" y="43" width="5" height="35" fill={ink} />
			<rect x="101" y="43" width="5" height="35" fill={ink} />
			{/* Front door + window + knob */}
			<rect x="52" y="50" width="16" height="28" fill="none" stroke={ink} strokeWidth="2" />
			<rect x="55.5" y="53.5" width="9" height="7" fill={accent} />
			<circle cx="65" cy="66" r="1.1" fill={ink} />
			{/* Porch light by the door */}
			<line x1="50" y1="43" x2="50" y2="48" stroke={ink} strokeWidth="1" />
			<rect x="48.3" y="48" width="3.4" height="4.5" rx="0.8" fill={accent} />
			{/* Railings */}
			<rect x="19" y="60" width="24" height="2.4" fill={ink} />
			<rect x="77" y="60" width="24" height="2.4" fill={ink} />
			{leftBalusters.map((x) => (
				<rect key={`l${x}`} x={x} y="62" width="1.6" height="16" fill={ink} />
			))}
			{rightBalusters.map((x) => (
				<rect key={`r${x}`} x={x} y="62" width="1.6" height="16" fill={ink} />
			))}
			{/* Deck */}
			<rect x="7" y="78" width="106" height="5" fill={ink} />
			{/* Steps */}
			<rect x="48" y="83" width="24" height="4" fill={accent} />
			<rect x="44" y="87" width="32" height="4" fill={ink} />
			<rect x="40" y="91" width="40" height="4" fill={accent} />
			{/* Ground line */}
			<rect x="0" y="95" width="120" height="1.6" fill={ink} />
		</svg>
	)
}
