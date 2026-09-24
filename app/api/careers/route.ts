import { NextResponse, type NextRequest } from 'next/server'

import { attributionSchema, type ValidAttribution } from '@/lib/attribution/shared'
import {
	ApplicationRateLimited,
	completeApplication,
	resumeBytesMatch,
	saveApplication,
	sendApplicationEmail,
	uploadResume,
	type ResumeFile,
} from '@/lib/careers/server'
import {
	MIN_FILL_MS,
	RESUME_MAX_BYTES,
	applicationSchema,
	cleanLine,
	resumeExtension,
	resumeProblem,
	toFieldErrors,
} from '@/lib/careers/shared'
import { checkRateLimit } from '@/lib/rate-limit'

/**
 * POST /api/careers — the careers application.
 *
 * Order matters (see docs in lib/careers/server.ts):
 *   1. spam checks → 2. validate → 3. save row → 4. upload resume to the
 *   private bucket → 5. email the team (resume attached) → 6. close the row.
 * The visitor only sees an error if NOTHING captured the application —
 * neither the database nor the email.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const GENERIC = 'Something went wrong sending your application. Please try again, or call us at (772) 473-7115.'

function fail(status: number, error: string, fieldErrors?: Record<string, string>) {
	return NextResponse.json({ ok: false, error, fieldErrors }, { status })
}

/** Looks like success to a bot, so it learns nothing. */
const quietOk = () => NextResponse.json({ ok: true })

function sameOrigin(req: NextRequest) {
	const origin = req.headers.get('origin')
	const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
	if (!origin || !host) return false
	try {
		return new URL(origin).host === host
	} catch {
		return false
	}
}

export async function POST(req: NextRequest) {
	if (!sameOrigin(req)) return fail(403, GENERIC)

	// Hard stop before reading the body: Vercel caps it at 4.5 MB anyway.
	const declared = Number(req.headers.get('content-length') || 0)
	if (declared > RESUME_MAX_BYTES + 256 * 1024) {
		return fail(413, 'That file is too large — the limit is 4 MB.', { resume: 'That file is too large — the limit is 4 MB' })
	}

	let form: FormData
	try {
		form = await req.formData()
	} catch {
		return fail(400, GENERIC)
	}

	// Spam trap 1: hidden field humans never see.
	if (cleanLine(form.get('company_website'))) return quietOk()
	// Spam trap 2: filled in faster than a person can type.
	const startedAt = Number(form.get('started_at') || 0)
	if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return quietOk()

	const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	if (!checkRateLimit({ key: `careers:${ip}`, limit: 6, windowMs: 10 * 60_000 }).allowed) {
		return fail(429, 'Too many applications from this connection. Please wait a few minutes and try again.')
	}

	// Validate the text fields.
	const parsed = applicationSchema.safeParse({
		firstName: String(form.get('firstName') ?? ''),
		lastName: String(form.get('lastName') ?? ''),
		phone: String(form.get('phone') ?? ''),
		email: String(form.get('email') ?? ''),
		location: String(form.get('location') ?? ''),
		message: String(form.get('message') ?? ''),
	})
	const fieldErrors = parsed.success ? {} : toFieldErrors(parsed.error)

	// Validate the resume (optional): name, size, and the actual bytes.
	let file: ResumeFile | null = null
	const upload = form.get('resume')
	if (upload && typeof upload === 'object' && 'arrayBuffer' in upload && upload.size > 0) {
		const problem = resumeProblem(upload)
		const ext = resumeExtension(upload.name)
		if (problem || !ext) {
			fieldErrors.resume = problem || 'Please upload a PDF, DOC, or DOCX file'
		} else {
			const bytes = Buffer.from(await upload.arrayBuffer())
			if (!resumeBytesMatch(ext, bytes)) {
				fieldErrors.resume = 'That file does not look like a real PDF or Word document'
			} else {
				file = { ext, originalName: cleanLine(upload.name), bytes }
			}
		}
	}

	if (!parsed.success || Object.keys(fieldErrors).length > 0) {
		return fail(422, 'Please fix the highlighted fields.', fieldErrors)
	}
	const input = parsed.data

	let attribution: ValidAttribution | undefined
	try {
		const raw = form.get('attribution')
		if (typeof raw === 'string' && raw && raw.length < 8000) {
			const a = attributionSchema.safeParse(JSON.parse(raw))
			if (a.success && a.data) attribution = a.data
		}
	} catch {
		// attribution is a nice-to-have; never block an applicant over it
	}

	const sourcePage = cleanLine(form.get('source_page')).slice(0, 300) || '/careers'
	const referrer = cleanLine(form.get('referrer')).slice(0, 500)
	const userAgent = cleanLine(req.headers.get('user-agent')).slice(0, 400)
	const submittedAt = new Date()

	// 3. Save the row.
	let saved: { id: string; uploadPath: string | null } | null = null
	let dbFailed = false
	try {
		saved = await saveApplication({
			input,
			resumeExt: file?.ext ?? null,
			sourcePage,
			referrer,
			userAgent,
			attribution,
		})
	} catch (e) {
		if (e instanceof ApplicationRateLimited) {
			return fail(
				429,
				'We already have your application — thank you. If something changed, email estimates@covenantbuilders.org.',
			)
		}
		dbFailed = true
		console.error('Careers: database save failed — falling back to email only:', e)
	}

	// 4. Upload the resume to the private bucket.
	let resumeStored = false
	if (file && saved?.uploadPath) {
		try {
			await uploadResume(saved.uploadPath, file)
			resumeStored = true
		} catch (e) {
			console.error('Careers: resume upload failed (the email still carries it):', e)
		}
	}

	// 5. Tell the team.
	const emailed = await sendApplicationEmail({
		input,
		file,
		resumeStored,
		applicationId: saved?.id ?? null,
		dbFailed,
		submittedAt,
		sourcePage,
		attribution,
	})

	// 6. Close the row (shuts the one-time upload door).
	if (saved) await completeApplication({ id: saved.id, file: resumeStored ? file : null, notified: emailed })

	if (!saved && !emailed) {
		console.error('Careers: application LOST — neither database nor email worked')
		return fail(500, GENERIC)
	}
	if (!emailed) console.error(`Careers: application ${saved?.id} saved but notification email failed`)

	return NextResponse.json({ ok: true })
}
