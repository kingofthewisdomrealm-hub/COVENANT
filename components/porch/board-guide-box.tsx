import { ContactForm } from '@/components/contact-form'
import { siteConfig } from '@/content/site'

/**
 * The single sponsor box on every Breezeway page (the condo paper).
 * Advisor-first: it offers the two board handouts, it does not sell repair
 * work. Do not add milestone / structural-repair service claims here — see
 * the licence-scope note in content/breezeway.ts.
 */
export function BoardGuideBox({ className = '' }: { className?: string }) {
	return (
		<section
			id="board-guide"
			aria-labelledby="board-guide-title"
			className={`scroll-mt-28 bg-navy px-6 py-10 text-white sm:px-10 ${className}`}
		>
			<div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
				<div>
					<p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-sand">
						From our sponsor
					</p>
					<h2 id="board-guide-title" className="mt-3 font-display text-3xl sm:text-4xl">
						Free for boards: two handouts before your next vote
					</h2>
					<ul className="mt-4 space-y-3 font-sans text-base leading-relaxed text-white/80">
						<li>
							<span className="font-semibold text-white">The Board Financing Guide.</span> Special
							assessment, loan, line of credit or a mix — what each costs an owner per month, and the
							vote each one needs.
						</li>
						<li>
							<span className="font-semibold text-white">8 Questions for Every Bidder.</span> One page
							to hand every contractor who bids your building&rsquo;s repairs.
						</li>
					</ul>
					<p className="mt-4 font-sans text-sm text-white/70">
						Tell us your building and we&rsquo;ll email both. Rather talk? Call or text{' '}
						<a className="text-sand underline" href={siteConfig.phones.sr.href}>
							{siteConfig.phones.sr.display}
						</a>
						.
					</p>
					<p className="mt-6 font-sans text-xs leading-relaxed text-white/60">
						General information, not legal, financial or engineering advice. Your association&rsquo;s
						attorney, engineer and manager have the final word.
					</p>
				</div>
				<div className="text-ink">
					<ContactForm />
				</div>
			</div>
		</section>
	)
}

