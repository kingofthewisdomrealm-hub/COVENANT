'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { siteConfig } from '@/content/site'
import { getAttribution } from '@/lib/attribution/client'
import { trackConversion } from '@/lib/attribution/events'
import {
	MESSAGE_MAX,
	RESUME_ACCEPT,
	RESUME_MAX_LABEL,
	applicationSchema,
	resumeProblem,
	toFieldErrors,
	type ApplicationField,
	type FieldErrors,
} from '@/lib/careers/shared'

const inputClass =
	'w-full border border-navy/15 bg-stone px-4 py-4 font-sans text-base text-ink outline-none ring-sand transition placeholder:text-stone-muted/70 focus:border-sand focus:ring-2 aria-[invalid=true]:border-red-600'
const labelClass = 'font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy'

type Status = 'idle' | 'sending' | 'done'

export function CareersForm() {
	const formRef = useRef<HTMLFormElement>(null)
	const successRef = useRef<HTMLHeadingElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const sendingRef = useRef(false) // blocks double-clicks before React re-renders
	const startedAt = useRef<number>(0)

	const [status, setStatus] = useState<Status>('idle')
	const [errors, setErrors] = useState<FieldErrors>({})
	const [formError, setFormError] = useState<string | null>(null)
	const [resume, setResume] = useState<File | null>(null)
	const [messageLength, setMessageLength] = useState(0)

	useEffect(() => {
		startedAt.current = Date.now()
	}, [])

	useEffect(() => {
		if (status === 'done') {
			successRef.current?.focus({ preventScroll: true })
			document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}, [status])

	const clearError = (field: ApplicationField) =>
		setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))

	const pickResume = (file: File | null) => {
		const problem = resumeProblem(file)
		if (problem) {
			setResume(null)
			if (fileInputRef.current) fileInputRef.current.value = ''
			setErrors((prev) => ({ ...prev, resume: problem }))
			return
		}
		clearError('resume')
		setResume(file && file.size > 0 ? file : null)
	}

	const removeResume = () => {
		setResume(null)
		if (fileInputRef.current) fileInputRef.current.value = ''
		clearError('resume')
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (sendingRef.current || status !== 'idle') return
		setFormError(null)

		const fd = new FormData(event.currentTarget)
		const parsed = applicationSchema.safeParse({
			firstName: String(fd.get('firstName') ?? ''),
			lastName: String(fd.get('lastName') ?? ''),
			phone: String(fd.get('phone') ?? ''),
			email: String(fd.get('email') ?? ''),
			location: String(fd.get('location') ?? ''),
			message: String(fd.get('message') ?? ''),
		})
		const found: FieldErrors = parsed.success ? {} : toFieldErrors(parsed.error)
		const fileProblem = resumeProblem(resume)
		if (fileProblem) found.resume = fileProblem

		if (Object.keys(found).length > 0) {
			setErrors(found)
			const first = Object.keys(found)[0]
			const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
			el?.focus()
			return
		}

		sendingRef.current = true
		setStatus('sending')
		setErrors({})

		// The file input is not controlled — make sure exactly the chosen file goes.
		fd.delete('resume')
		if (resume) fd.set('resume', resume, resume.name)
		fd.set('started_at', String(startedAt.current))
		fd.set('source_page', window.location.pathname + window.location.search)
		fd.set('referrer', document.referrer || '')
		try {
			const a = getAttribution()
			if (a) fd.set('attribution', JSON.stringify(a))
		} catch {
			// never block an application over tracking
		}

		try {
			const res = await fetch('/api/careers', { method: 'POST', body: fd })
			const data = (await res.json().catch(() => null)) as
				| { ok: boolean; error?: string; fieldErrors?: FieldErrors }
				| null

			if (res.ok && data?.ok) {
				setStatus('done')
				trackConversion('job_application_submit', { form: 'careers', has_resume: Boolean(resume) })
				return
			}
			if (data?.fieldErrors) setErrors(data.fieldErrors)
			setFormError(
				data?.error ||
					`Something went wrong sending your application. Please try again, or call us at ${siteConfig.phones.sr.display}.`,
			)
		} catch {
			setFormError(
				`We could not reach our server. Check your connection and try again, or call us at ${siteConfig.phones.sr.display}.`,
			)
		}
		sendingRef.current = false
		setStatus('idle')
	}

	if (status === 'done') {
		return (
			<div className="border border-sand/40 bg-white p-8 sm:p-10" role="status" aria-live="polite">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/20 text-sand-dark">
					<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
						<path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<h3 ref={successRef} tabIndex={-1} className="mt-6 font-display text-3xl text-navy outline-none">
					Application received.
				</h3>
				<p className="mt-4 body-copy">
					Thank you for your interest in Covenant Builders. If there is a potential fit, someone from
					our team will contact you.
				</p>
				<p className="mt-6 font-sans text-sm text-stone-muted">
					While you wait, see{' '}
					<Link href="/portfolio" className="text-navy underline underline-offset-2">
						the work we do
					</Link>
					.
				</p>
			</div>
		)
	}

	const sending = status === 'sending'
	const err = (field: ApplicationField) =>
		errors[field] ? (
			<span id={`${field}-error`} className="block font-sans text-sm text-red-700">
				{errors[field]}
			</span>
		) : null
	const aria = (field: ApplicationField) => ({
		'aria-invalid': Boolean(errors[field]),
		'aria-describedby': errors[field] ? `${field}-error` : undefined,
	})

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			className="relative space-y-6 border border-navy/10 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,30,60,0.35)] sm:p-8"
			noValidate
			aria-busy={sending}
		>
			<fieldset disabled={sending} className="space-y-6">
				<div className="grid gap-6 sm:grid-cols-2">
					<label className="block space-y-2">
						<span className={labelClass}>First name</span>
						<input name="firstName" type="text" autoComplete="given-name" required maxLength={80}
							className={inputClass} onChange={() => clearError('firstName')} {...aria('firstName')} />
						{err('firstName')}
					</label>
					<label className="block space-y-2">
						<span className={labelClass}>Last name</span>
						<input name="lastName" type="text" autoComplete="family-name" required maxLength={80}
							className={inputClass} onChange={() => clearError('lastName')} {...aria('lastName')} />
						{err('lastName')}
					</label>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<label className="block space-y-2">
						<span className={labelClass}>Phone number</span>
						<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40}
							placeholder="(772) 555-0123"
							className={inputClass} onChange={() => clearError('phone')} {...aria('phone')} />
						{err('phone')}
					</label>
					<label className="block space-y-2">
						<span className={labelClass}>Email address</span>
						<input name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="off"
							spellCheck={false} required maxLength={200}
							className={inputClass} onChange={() => clearError('email')} {...aria('email')} />
						{err('email')}
					</label>
				</div>

				<label className="block space-y-2">
					<span className={labelClass}>Location</span>
					<input name="location" type="text" autoComplete="address-level2" required maxLength={120}
						placeholder="City, State"
						className={inputClass} onChange={() => clearError('location')} {...aria('location')} />
					{err('location')}
				</label>

				<div className="space-y-2">
					<span className={labelClass} id="resume-label">
						Resume <span className="font-normal normal-case tracking-normal text-stone-muted">(optional)</span>
					</span>
					{resume ? (
						<div className="flex items-center gap-4 border border-sand/50 bg-sand/10 px-4 py-4">
							<FileIcon />
							<div className="min-w-0 flex-1">
								<p className="truncate font-sans text-base font-medium text-navy">{resume.name}</p>
								<p className="font-sans text-sm text-stone-muted">{formatSize(resume.size)}</p>
							</div>
							<button type="button" onClick={removeResume}
								className="min-h-[44px] shrink-0 px-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-navy underline underline-offset-4 hover:text-sand-dark">
								Remove
							</button>
						</div>
					) : (
						<label
							className={`flex min-h-[112px] cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-6 text-center transition hover:border-sand hover:bg-sand/5 focus-within:border-sand focus-within:ring-2 focus-within:ring-sand ${
								errors.resume ? 'border-red-600' : 'border-navy/20'
							}`}
						>
							<UploadIcon />
							<span className="font-sans text-base font-semibold text-navy">Upload your resume</span>
							<span className="font-sans text-sm text-stone-muted">PDF, DOC, or DOCX · up to {RESUME_MAX_LABEL}</span>
							<input ref={fileInputRef} name="resume" type="file" accept={RESUME_ACCEPT} className="sr-only"
								aria-labelledby="resume-label" {...aria('resume')}
								onChange={(e) => pickResume(e.currentTarget.files?.[0] ?? null)} />
						</label>
					)}
					{err('resume')}
				</div>

				<label className="block space-y-2">
					<span className={labelClass}>One thing you would like us to know about you</span>
					<textarea name="message" rows={5} maxLength={MESSAGE_MAX}
						placeholder="Tell us something about yourself that we wouldn't learn from your resume."
						className={`${inputClass} min-h-[150px] resize-y`}
						onChange={(e) => {
							setMessageLength(e.currentTarget.value.length)
							clearError('message')
						}}
						{...aria('message')} />
					<span className="flex justify-between gap-4">
						{err('message') ?? <span />}
						{messageLength > MESSAGE_MAX - 300 ? (
							<span className="font-sans text-xs text-stone-muted">{messageLength}/{MESSAGE_MAX}</span>
						) : null}
					</span>
				</label>

				{/* Spam trap — hidden from people, irresistible to bots. */}
				<div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
					<label>
						Company website
						<input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
					</label>
				</div>
			</fieldset>

			{formError ? (
				<p className="border-l-4 border-red-600 bg-red-50 px-4 py-3 font-sans text-sm text-red-800" role="alert">
					{formError}
				</p>
			) : null}

			<button type="submit" disabled={sending} aria-disabled={sending}
				className="btn-primary min-h-[56px] w-full gap-3 text-base disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:min-w-[260px]">
				{sending ? (
					<>
						<Spinner />
						Sending application…
					</>
				) : (
					'Submit Application'
				)}
			</button>

			<p className="font-sans text-xs leading-relaxed text-stone-muted">
				Your application goes straight to the Covenant Builders team and is never shared. See our{' '}
				<Link href="/privacy" className="underline underline-offset-2">
					Privacy Policy
				</Link>
				.
			</p>
		</form>
	)
}

function formatSize(bytes: number) {
	if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Spinner() {
	return (
		<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
			<path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
		</svg>
	)
}

function UploadIcon() {
	return (
		<svg viewBox="0 0 24 24" className="h-8 w-8 text-sand-dark" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
			<path d="M12 16V4m0 0l-4.5 4.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
		</svg>
	)
}

function FileIcon() {
	return (
		<svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-sand-dark" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
			<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" strokeLinejoin="round" />
			<path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" />
		</svg>
	)
}
