/**
 * The Orlando Balcony logo — an actual balcony: cornice and keystone, an
 * arched French door with shutters, a wrought-iron railing with scroll rings
 * and finial posts, a flower box on the rail, the slab on three brackets, and
 * the window of the floor below. Plain SVG so it works in the masthead and in
 * next/og share images (no Tailwind classes inside; colors are passed in).
 */
export function BalconyLogoSvg({
	width = 120,
	ink = '#12182B',
	accent = '#C4A574',
	title = 'The Orlando Balcony',
}: {
	width?: number
	ink?: string
	accent?: string
	title?: string
}) {
	const height = Math.round((width * 100) / 120)
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 120 100"
			role="img"
			aria-label={`${title} logo: a balcony`}
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="12" y="2" width="96" height="3.5" fill={ink}/>
			<rect x="15" y="5.5" width="90" height="1.4" fill={accent}/>
			<rect x="17" y="6.9" width="1.8" height="89" fill={ink}/>
			<rect x="101.2" y="6.9" width="1.8" height="89" fill={ink}/>
			<rect x="27" y="24" width="8" height="38" fill="none" stroke={ink} strokeWidth="1.6"/>
			<line x1="28" y1="28" x2="34" y2="28" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="32" x2="34" y2="32" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="36" x2="34" y2="36" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="40" x2="34" y2="40" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="44" x2="34" y2="44" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="48" x2="34" y2="48" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="52" x2="34" y2="52" stroke={accent} strokeWidth="1"/>
			<line x1="28" y1="56" x2="34" y2="56" stroke={accent} strokeWidth="1"/>
			<rect x="85" y="24" width="8" height="38" fill="none" stroke={ink} strokeWidth="1.6"/>
			<line x1="86" y1="28" x2="92" y2="28" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="32" x2="92" y2="32" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="36" x2="92" y2="36" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="40" x2="92" y2="40" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="44" x2="92" y2="44" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="48" x2="92" y2="48" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="52" x2="92" y2="52" stroke={accent} strokeWidth="1"/>
			<line x1="86" y1="56" x2="92" y2="56" stroke={accent} strokeWidth="1"/>
			<path d="M39 62 V28 A21 21 0 0 1 81 28 V62 Z" fill={ink}/>
			<path d="M43 62 V29 A17 17 0 0 1 77 29 V62 Z" fill={accent}/>
			<rect x="59" y="12" width="2" height="50" fill={ink}/>
			<rect x="43" y="34" width="34" height="1.6" fill={ink}/>
			<polygon points="57,4.5 63,4.5 62,10 58,10" fill={accent} stroke={ink} strokeWidth="1"/>
			<rect x="9" y="41" width="102" height="2.8" fill={ink}/>
			<rect x="9" y="41" width="3" height="21" fill={ink}/>
			<circle cx="10.5" cy="39" r="2.3" fill={ink}/>
			<rect x="108" y="41" width="3" height="21" fill={ink}/>
			<circle cx="109.5" cy="39" r="2.3" fill={ink}/>
			<rect x="15" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="21" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="27" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="33" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="39" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="45" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="51" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="57" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="63" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="69" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="75" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="81" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="87" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="93" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="99" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<rect x="105" y="43.8" width="1.4" height="18.2" fill={ink}/>
			<circle cx="18.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="24.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="30.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="36.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="42.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="48.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="54.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="60.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="66.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="72.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="78.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="84.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="90.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="96.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<circle cx="102.7" cy="53" r="1.9" fill="none" stroke={ink} strokeWidth="1"/>
			<rect x="9" y="59" width="102" height="1.4" fill={ink}/>
			<rect x="6" y="62" width="108" height="5" fill={ink}/>
			<rect x="6" y="67" width="108" height="1.3" fill={accent}/>
			<path d="M19 68.3 H29 Q25.5 70.5 25.2 76 H22.8 Q22.5 70.5 19 68.3 Z" fill={ink}/>
			<path d="M55 68.3 H65 Q61.5 70.5 61.2 76 H58.8 Q58.5 70.5 55 68.3 Z" fill={ink}/>
			<path d="M91 68.3 H101 Q97.5 70.5 97.2 76 H94.8 Q94.5 70.5 91 68.3 Z" fill={ink}/>
			<polygon points="22,36 34,36 33,41 23,41" fill={accent} stroke={ink} strokeWidth="1"/>
			<circle cx="25" cy="34" r="1.7" fill={ink}/>
			<circle cx="28" cy="34" r="1.7" fill={ink}/>
			<circle cx="31" cy="34" r="1.7" fill={ink}/>
			<rect x="50" y="84" width="20" height="12" fill="none" stroke={ink} strokeWidth="1.6"/>
			<rect x="59.3" y="84" width="1.4" height="12" fill={ink}/>
			<rect x="0" y="96" width="120" height="1.6" fill={ink}/>
		</svg>
	)
}
