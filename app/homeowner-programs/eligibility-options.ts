/**
 * Shared between the eligibility form (client) and the server action.
 * Lives outside app/actions/programs.ts because a 'use server' module may
 * only export async functions — constants exported from one break the build.
 */

export const NEED_OPTIONS = [
	{ value: 'storm-proof', label: 'Storm-proof my property' },
	{ value: 'claim', label: 'My claim went wrong' },
	{ value: 'repair-money', label: 'I need repair money' },
	{ value: 'taxes', label: 'Lower my property taxes' },
] as const

export const PROPERTY_OPTIONS = [
	{ value: 'single-family', label: 'Single-family home I live in' },
	{ value: 'condo-unit', label: 'Condo unit' },
	{ value: 'condo-association', label: 'Condo association / board' },
	{ value: 'rental-commercial', label: 'Rental or commercial property' },
] as const

export type NeedValue = (typeof NEED_OPTIONS)[number]['value']
export type PropertyValue = (typeof PROPERTY_OPTIONS)[number]['value']

export type ProgramMatch = {
	name: string
	pays: string
	note: string
}
