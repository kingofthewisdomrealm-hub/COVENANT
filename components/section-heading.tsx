interface SectionHeadingProps {
	eyebrow?: string
	title: string
	description?: string
	tone?: 'light' | 'dark'
}

export function SectionHeading({
	eyebrow,
	title,
	description,
	tone = 'light',
}: SectionHeadingProps) {
	const titleClass =
		tone === 'dark' ? 'text-white' : 'text-navy'
	const descriptionClass =
		tone === 'dark' ? 'text-white/75' : 'text-stone-muted'

	return (
		<div className="max-w-2xl reveal">
			{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
			<h2 className={`mt-3 display-title ${titleClass}`}>{title}</h2>
			{description ? (
				<p className={`mt-4 body-copy ${descriptionClass}`}>{description}</p>
			) : null}
		</div>
	)
}
