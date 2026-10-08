import { ContactForm } from '@/components/contact-form'
import { siteConfig } from '@/content/site'

/**
 * The single sponsor box on every Vero Porch page. Roof-advertising copy:
 * see the F.S. §489.147 rules in content/storm-check.ts before editing.
 */
export function PorchReportCardBox({ className = '' }: { className?: string }) {
	return (
		<section
			id="report-card"
			aria-labelledby="report-card-title"
			className={`scroll-mt-28 bg-navy px-6 py-10 text-white sm:px-10 ${className}`}
		>
			<div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
				<div>
					<p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-sand">
						From our sponsor
					</p>
					<h2 id="report-card-title" className="mt-3 font-display text-3xl sm:text-4xl">
						Get your free Roof Report Card
					</h2>
					<p className="mt-4 font-sans text-base leading-relaxed text-white/80">
						We walk your roof line, attic and edges and grade what we can see from A to F, with
						photos and plain words. You get the card by text. Nothing to buy, and nothing comes
						attached to it.
					</p>
					<p className="mt-4 font-sans text-sm text-white/70">
						Rather talk? Call or text{' '}
						<a className="text-sand underline" href={siteConfig.phones.sr.href}>
							{siteConfig.phones.sr.display}
						</a>
						.
					</p>
					<p className="mt-6 font-sans text-xs leading-relaxed text-white/60">
						A Report Card is a visual walk-through, not a 4-point, wind mitigation or roof
						certification form, and not an engineering inspection.
					</p>
				</div>
				<div className="text-ink">
					<ContactForm />
				</div>
			</div>
		</section>
	)
}
