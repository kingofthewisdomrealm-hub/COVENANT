/**
 * Careers application rules — shared by the browser form and the server so the
 * two can never disagree about what a valid application is.
 * No server-only imports in this file.
 */
import { z } from 'zod'

/** Vercel rejects request bodies over 4.5 MB, so the resume cap sits below it. */
export const RESUME_MAX_BYTES = 4 * 1024 * 1024
export const RESUME_MAX_LABEL = '4 MB'
export const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'] as const
export type ResumeExt = (typeof RESUME_EXTENSIONS)[number]
export const RESUME_ACCEPT =
	'.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
export const RESUME_MIME: Record<ResumeExt, string> = {
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
export const MESSAGE_MAX = 3000

/** Strip control characters and invisible junk, collapse runs of spaces. */
export function cleanLine(value: unknown): string {
	return String(value ?? '')
		.normalize('NFKC')
		// eslint-disable-next-line no-control-regex
		.replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

/** Same as cleanLine but keeps line breaks (max two in a row). */
export function cleanBlock(value: unknown): string {
	return String(value ?? '')
		.normalize('NFKC')
		.replace(/\r\n?/g, '\n')
		// eslint-disable-next-line no-control-regex
		.replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, ' ')
		.replace(/[ \t]+/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

const namePart = (label: string) =>
	z
		.string()
		.transform(cleanLine)
		.pipe(
			z
				.string()
				.min(1, `Please enter your ${label}`)
				.max(80, `${label[0].toUpperCase()}${label.slice(1)} is too long`)
				.regex(/^[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u024f' .-]+$/, `Please use letters only in your ${label}`),
		)

export const applicationSchema = z.object({
	firstName: namePart('first name'),
	lastName: namePart('last name'),
	phone: z
		.string()
		.transform(cleanLine)
		.pipe(
			z
				.string()
				.max(40, 'Phone number is too long')
				.regex(/^[0-9+().\s-]+$/, 'Please enter a valid phone number')
				.refine((v) => v.replace(/\D/g, '').length >= 10, 'Please enter a 10-digit phone number'),
		),
	email: z
		.string()
		.transform((v) => cleanLine(v).toLowerCase())
		.pipe(z.string().max(200, 'Email is too long').email('Please enter a valid email address')),
	location: z
		.string()
		.transform(cleanLine)
		.pipe(z.string().min(2, 'Please enter your city and state').max(120, 'Location is too long')),
	message: z
		.string()
		.transform(cleanBlock)
		.pipe(z.string().max(MESSAGE_MAX, `Please keep this under ${MESSAGE_MAX} characters`)),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
export type ApplicationField = keyof ApplicationInput | 'resume'
export type FieldErrors = Partial<Record<ApplicationField, string>>

export function resumeExtension(fileName: string): ResumeExt | null {
	const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
	return (RESUME_EXTENSIONS as readonly string[]).includes(ext) ? (ext as ResumeExt) : null
}

/** Browser + server check on name and size (the server also checks the bytes). */
export function resumeProblem(file: { name: string; size: number } | null): string | null {
	if (!file || file.size === 0) return null
	if (!resumeExtension(file.name)) return 'Please upload a PDF, DOC, or DOCX file'
	if (file.size > RESUME_MAX_BYTES) return `That file is too large — the limit is ${RESUME_MAX_LABEL}`
	return null
}

/** Turns a zod failure into one message per field. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
	const out: FieldErrors = {}
	for (const issue of error.issues) {
		const key = issue.path[0] as ApplicationField | undefined
		if (key && !out[key]) out[key] = issue.message
	}
	return out
}

/** A human must spend at least this long on the page before submitting. */
export const MIN_FILL_MS = 3000
