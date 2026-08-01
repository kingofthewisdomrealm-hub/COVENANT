import type { ProcessStage } from '@/content/site'

interface ProcessTimelineProps {
	stages: readonly ProcessStage[]
	/** Optional lead-in shown above the stages. */
	note?: string
	/** Used to build stable list keys when several timelines share a page. */
	idPrefix: string
}

/**
 * Client-facing process timeline.
 *
 * Renders PUBLIC stage data only. Internal SOP content lives in
 * `docs/process-*.md` and must never be surfaced here.
 */
export function ProcessTimeline({
	stages,
	note,
	idPrefix,
}: ProcessTimelineProps) {
	if (stages.length === 0) return null

	return (
		<div className="mt-10 border-t border-navy/10 pt-8">
			<p className="eyebrow">How this project runs</p>

			{note ? (
				<p className="mt-4 max-w-2xl body-copy text-stone-muted">{note}</p>
			) : null}

			<ol className="mt-8 space-y-0">
				{stages.map((stage, index) => {
					const isLast = index === stages.length - 1

					return (
						<li
							key={`${idPrefix}-${stage.title}`}
							className="relative grid gap-x-5 gap-y-2 pb-8 pl-12 last:pb-0 sm:grid-cols-[1fr_auto]"
						>
							{/* Connector line between markers */}
							{!isLast ? (
								<span
									aria-hidden="true"
									className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-navy/15"
								/>
							) : null}

							{/* Stage number */}
							<span
								aria-hidden="true"
								className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-white font-sans text-xs font-semibold tracking-[0.08em] text-navy"
							>
								{String(index + 1).padStart(2, '0')}
							</span>

							<h3 className="font-display text-2xl leading-tight text-navy sm:col-start-1">
								{stage.title}
							</h3>

							<p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-stone-muted sm:col-start-2 sm:row-start-1 sm:pt-2 sm:text-right">
								{stage.duration}
							</p>

							<p className="max-w-2xl body-copy sm:col-start-1">
								{stage.summary}
							</p>
						</li>
					)
				})}
			</ol>

			<p className="mt-6 font-sans text-xs text-stone-muted">
				Timeframes are typical ranges, not guarantees. Permit review times are
				set by the building department and are outside our control.
			</p>
		</div>
	)
}
