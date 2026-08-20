import { projectBranches, type BranchKey } from '@/content/design-your-project'

export interface DesignAnswers {
	projectType: BranchKey
	property: string
	city: string
	scope: string[]
	size?: string
	finishLevel?: string
	boardStage?: string
	timeline: string
	budgetBand: string
	name: string
	email: string
	phone: string
	projectAddress: string
	notes?: string
}

export function branchFor(key: BranchKey) {
	return projectBranches.find((branch) => branch.key === key)
}

/**
 * Renders the answers as the plain-text project brief.
 *
 * This single string is what the prospect reads, what lands in the estimator's
 * inbox, and what gets written to the CRM as the job message — so it has to be
 * legible to a person, not just parseable. Keep it plain text: it goes into a
 * Resend text body and a Postgres text column, neither of which wants markup.
 */
export function formatDesignBrief(answers: DesignAnswers): string {
	const branch = branchFor(answers.projectType)
	const lines: string[] = []

	const add = (label: string, value?: string | null) => {
		if (value && value.trim()) lines.push(`${label}: ${value}`)
	}

	add('Project type', branch?.label || answers.projectType)
	add('Property', answers.property)
	add('City', answers.city)
	add('Scope', answers.scope.join(' · '))
	add('Size', answers.size)
	add('Finish level', answers.finishLevel)
	add('Board stage', answers.boardStage)
	add('Timeline', answers.timeline)
	add('Budget range', answers.budgetBand)

	if (answers.notes && answers.notes.trim()) {
		lines.push('', 'Notes from the client:', answers.notes.trim())
	}

	return lines.join('\n')
}
