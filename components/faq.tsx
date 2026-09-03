import type { FaqItem } from '@/content/faqs'
import { siteConfig } from '@/content/site'

interface FaqProps {
	/** Path this FAQ lives on, e.g. '/services'. Used for the JSON-LD @id. */
	path: string
	eyebrow?: string
	title?: string
	description?: string
	items: FaqItem[]
	/** Tailwind classes for the wrapping <section>. */
	className?: string
}

/**
 * A visible FAQ section that also emits FAQPage structured data for the SAME
 * items.
 *
 * Both outputs come from one `items` array on purpose. Google requires FAQ
 * markup to match content a visitor can actually see; emitting schema for
 * hidden text is a guideline violation and gets the markup ignored at best.
 * Rendering the visible list and the JSON-LD from a single source makes drift
 * impossible rather than merely unlikely.
 *
 * The answers sit inside <details>, which keeps the text in the HTML — closed
 * disclosure content is still crawlable — while keeping the page short.
 */
export function Faq({
	path,
	eyebrow = 'Questions',
	title = 'Straight answers',
	description,
	items,
	className = 'surface-atmosphere py-20 sm:py-24',
}: FaqProps) {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		'@id': `${siteConfig.url}${path}#faq`,
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	}

	return (
		<section className={className} id="faq">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<div className="section-shell space-y-10">
				<div className="max-w-2xl">
					<p className="eyebrow">{eyebrow}</p>
					<h2 className="mt-3 display-title text-navy">{title}</h2>
					{description ? (
						<p className="mt-5 body-copy text-stone-muted">{description}</p>
					) : null}
				</div>

				<dl className="max-w-3xl divide-y divide-navy/10 border-t border-navy/10">
					{items.map((item) => (
						<div key={item.question} className="py-5">
							<details className="group">
								<summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-sans text-base font-semibold text-navy marker:hidden">
									<dt>{item.question}</dt>
									<span
										aria-hidden="true"
										className="mt-1 shrink-0 font-sans text-sand transition-transform group-open:rotate-45"
									>
										+
									</span>
								</summary>
								<dd className="mt-3 max-w-2xl body-copy text-stone-muted">
									{item.answer}
								</dd>
							</details>
						</div>
					))}
				</dl>
			</div>
		</section>
	)
}
