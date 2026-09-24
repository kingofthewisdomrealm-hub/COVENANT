import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

import { siteConfig } from '@/content/site'
import { attributionEmailLines, type ValidAttribution } from '@/lib/attribution/shared'

import { RESUME_MIME, type ApplicationInput, type ResumeExt } from './shared'

/**
 * Server side of the careers form.
 *
 * Same security model as lib/crm.ts: only the publishable (anon) key, and the
 * database only lets it through two SECURITY DEFINER functions plus a
 * one-time upload into the private "resumes" bucket
 * (see supabase/careers/001_careers.sql).
 */

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY

export type ResumeFile = {
	ext: ResumeExt
	originalName: string
	bytes: Buffer
}

function db(): SupabaseClient | null {
	if (!url || !key) return null
	return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

/**
 * Checks the first bytes of the file really are a PDF / Word document,
 * whatever the file name claims.
 */
export function resumeBytesMatch(ext: ResumeExt, bytes: Buffer): boolean {
	if (bytes.length < 8) return false
	if (ext === 'pdf') return bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))
	if (ext === 'doc')
		return bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
	// .docx is a zip that contains a word/ folder
	return (
		bytes.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])) &&
		bytes.includes(Buffer.from('word/'))
	)
}

/** A file name that is safe in an email attachment and a mail client. */
export function safeResumeName(input: ApplicationInput, ext: ResumeExt) {
	const slug = (s: string) =>
		s
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^A-Za-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 40) || 'applicant'
	return `${slug(input.firstName)}-${slug(input.lastName)}-resume.${ext}`
}

export class ApplicationRateLimited extends Error {}

/** Step 1 — create the row. Returns null when the database is not configured. */
export async function saveApplication(args: {
	input: ApplicationInput
	resumeExt: ResumeExt | null
	sourcePage: string
	referrer: string
	userAgent: string
	attribution: ValidAttribution | undefined
}): Promise<{ id: string; uploadPath: string | null } | null> {
	const supabase = db()
	if (!supabase) {
		console.warn('Careers: SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY not set — application not stored')
		return null
	}
	const { input } = args
	const { data, error } = await supabase.rpc('submit_job_application', {
		p: {
			first_name: input.firstName,
			last_name: input.lastName,
			phone: input.phone,
			email: input.email,
			location: input.location,
			message: input.message,
			resume_ext: args.resumeExt ?? '',
			source_page: args.sourcePage,
			referrer: args.referrer,
			user_agent: args.userAgent,
			attribution: args.attribution ?? null,
		},
	})
	if (error) {
		if (error.message.includes('rate_limited')) throw new ApplicationRateLimited()
		throw new Error(`submit_job_application failed: ${error.message}`)
	}
	const row = (Array.isArray(data) ? data[0] : data) as
		| { application_id: string; upload_path: string | null }
		| undefined
	if (!row?.application_id) throw new Error('submit_job_application returned no id')
	return { id: row.application_id, uploadPath: row.upload_path }
}

/** Step 2 — put the resume in the private bucket, at the path the DB issued. */
export async function uploadResume(path: string, file: ResumeFile) {
	const supabase = db()
	if (!supabase) throw new Error('Supabase not configured')
	const { error } = await supabase.storage.from('resumes').upload(path, file.bytes, {
		contentType: RESUME_MIME[file.ext],
		upsert: false,
		cacheControl: 'no-store',
	})
	if (error) throw new Error(`Resume upload failed: ${error.message}`)
}

/** Step 3 — close the application (records resume + email status, shuts the upload door). */
export async function completeApplication(args: {
	id: string
	file: ResumeFile | null
	notified: boolean
}) {
	const supabase = db()
	if (!supabase) return
	const { error } = await supabase.rpc('complete_job_application', {
		p_id: args.id,
		p_resume_filename: args.file?.originalName.slice(0, 200) ?? null,
		p_resume_size: args.file?.bytes.length ?? null,
		p_resume_mime: args.file ? RESUME_MIME[args.file.ext] : null,
		p_notified: args.notified,
	})
	if (error) console.error('Careers: complete_job_application failed (application is saved):', error.message)
}

/**
 * The notification email. The resume rides along as an attachment, so it can
 * be opened straight from the inbox without anything public ever existing.
 * Returns true when Resend accepted it.
 */
export async function sendApplicationEmail(args: {
	input: ApplicationInput
	file: ResumeFile | null
	resumeStored: boolean
	applicationId: string | null
	dbFailed: boolean
	submittedAt: Date
	sourcePage: string
	attribution: ValidAttribution | undefined
}): Promise<boolean> {
	const apiKey = process.env.RESEND_API_KEY
	const to = (process.env.CAREERS_TO_EMAIL || process.env.LEAD_TO_EMAIL || siteConfig.emails.estimating)
		.split(',')
		.map((a) => a.trim())
		.filter(Boolean)
	const from = process.env.LEAD_FROM_EMAIL || 'Covenant Builders <onboarding@resend.dev>'

	if (!apiKey || to.length === 0) {
		console.error('Careers: RESEND_API_KEY or recipient missing — no notification sent')
		return false
	}

	const { input, file } = args
	const fullName = `${input.firstName} ${input.lastName}`
	const when = args.submittedAt.toLocaleString('en-US', {
		timeZone: 'America/New_York',
		dateStyle: 'medium',
		timeStyle: 'short',
	})

	const resumeLine = file
		? `Resume: attached (${safeResumeName(input, file.ext)}, ${Math.max(1, Math.round(file.bytes.length / 1024))} KB)` +
			(args.resumeStored
				? ` — private copy in Lovable Cloud → Storage → resumes → applications/${args.applicationId}/`
				: ' — NOT saved to storage, keep this email')
		: 'Resume: none uploaded'

	const storageLine = args.dbFailed
		? 'WARNING: this application could NOT be saved to the database. This email is the only copy.'
		: args.applicationId
			? `Saved: Lovable Cloud → Database → job_applications (id ${args.applicationId})`
			: 'Database not configured — this email is the only copy.'

	const text = [
		'New Covenant Builders Application',
		'',
		`Name: ${fullName}`,
		`Phone: ${input.phone}`,
		`Email: ${input.email}`,
		`Location: ${input.location}`,
		'Message:',
		input.message || '(left blank)',
		'',
		resumeLine,
		'',
		`Submitted: ${when} (Eastern)`,
		`Source page: ${args.sourcePage}`,
		storageLine,
		...attributionEmailLines(args.attribution),
	].join('\n')

	const subject = `${args.dbFailed ? '[NOT SAVED] ' : ''}New Covenant Builders Application — ${fullName}`

	const resend = new Resend(apiKey)
	const payload = {
		from,
		to,
		replyTo: input.email,
		subject,
		text,
		attachments: file ? [{ filename: safeResumeName(input, file.ext), content: file.bytes.toString('base64'), contentType: RESUME_MIME[file.ext] }] : undefined,
	}

	// One send at a time, one retry — Resend rate-limits (~2 req/sec).
	for (let attempt = 0; attempt < 2; attempt++) {
		try {
			const { error } = await resend.emails.send(payload)
			if (!error) return true
			console.error(`Careers: Resend error (attempt ${attempt + 1}):`, error)
		} catch (e) {
			console.error(`Careers: Resend threw (attempt ${attempt + 1}):`, e)
		}
		if (attempt === 0) await new Promise((r) => setTimeout(r, 1200))
	}
	return false
}
