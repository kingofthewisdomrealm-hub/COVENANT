import { categories, findScope, tierCopy } from '@/content/estimator/catalog'

import type { EstimateResult } from './engine'
import type { Findings } from './vision'

export const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
export const range = (m: { low: number; high: number }) => (m.low === m.high ? usd(m.low) : `${usd(m.low)} – ${usd(m.high)}`)

export function scopeLabel(categoryId: string, scopeId: string) {
	const found = findScope(categoryId, scopeId)
	if (found) return `${found.category.label} — ${found.scope.label}`
	return categories.find((c) => c.id === categoryId)?.label ?? 'Not sure yet'
}

export function answerLines(categoryId: string, scopeId: string, answers: Record<string, unknown>) {
	const found = findScope(categoryId, scopeId)
	if (!found) return []
	return found.scope.questions
		.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '')
		.map((q) => {
			const v = answers[q.id]
			const shown = q.options?.find((o) => o.value === String(v))?.label ?? `${v}${q.unit ? ' ' + q.unit : ''}`
			return `${q.label}: ${shown}`
		})
}

export function estimateLines(r: EstimateResult): string[] {
	if (r.kind !== 'priced') return [`No online price: ${r.message}`, ...(r.missing?.length ? [`Missing: ${r.missing.join('; ')}`] : [])]
	return [
		r.draftPrices ? '*** DRAFT PRICES — pricebook not yet approved ***' : '',
		`${r.budgetIndication ? 'Budget indication (low confidence)' : 'Preliminary estimate'} · confidence ${r.confidence} · pricebook as of ${r.asOf}`,
		...r.quantities.map((q) => `${q.label}: ${q.value.toLocaleString('en-US')} ${q.unit}`),
		'',
		...r.tiers.flatMap((t) => [
			`${tierCopy[t.tier].label.toUpperCase()}: ${range(t.total)}${t.materialNote ? ` (${t.materialNote})` : ''}`,
			`   materials ${range(t.materials)} · labor ${range(t.labor)} · disposal/equipment/permits ${range(t.other)} · overhead & profit ${range(t.overheadProfit)}`,
		]),
		'',
		'Assumptions:',
		...r.assumptions.map((a) => `- ${a}`),
	].filter((l, i, a) => l !== '' || a[i - 1] !== '')
}

export function findingsLines(f: Findings | null | undefined): string[] {
	if (!f) return ['AI read-out: none (AI off, failed, or customer chose by hand).']
	return [
		`AI read-out (confidence ${f.confidence}, image quality ${f.imageQuality}) — as submitted by the browser:`,
		`- Item: ${f.component || '—'}`,
		`- Probable material: ${f.probableMaterial || '—'}`,
		`- Visible condition: ${f.visibleCondition || '—'}`,
		`- Suggested scope: ${f.recommendedScope || '—'}`,
		f.possibleHiddenIssues.length ? `- Possible hidden issues: ${f.possibleHiddenIssues.join('; ')}` : '',
		f.uncertainty ? `- Unsure about: ${f.uncertainty}` : '',
		f.missingInfo.length ? `- Missing info: ${f.missingInfo.join('; ')}` : '',
	].filter(Boolean)
}
