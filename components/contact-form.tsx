'use client'

import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'

import { submitLead } from '@/app/actions/lead'
import { projectTypes, siteConfig } from '@/content/site'

export function ContactForm() {
	const [isSuccess, setIsSuccess] = useState(false)
	const { execute, isExecuting, result, hasErrored } = useAction(submitLead, {
		onSuccess: ({ data }) => {
			if (data?.ok) setIsSuccess(true)
		},
	})

	const fieldErrors = result.validationErrors?.fieldErrors
	const serverError = result.serverError

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSuccess(false)
		const formData = new FormData(event.currentTarget)
		execute({
			name: String(formData.get('name') || ''),
			email: String(formData.get('email') || ''),
			phone: String(formData.get('phone') || ''),
			projectAddress: String(formData.get('projectAddress') || ''),
			projectType: String(formData.get('projectType') || ''),
			message: String(formData.get('message') || ''),
			website: String(formData.get('website') || ''),
		})
	}

	if (isSuccess) {
		return (
			<div
				className="border border-sand/40 bg-white/80 p-8"
				role="status"
				aria-live="polite"
			>
				<h3 className="font-display text-2xl text-navy">Request received</h3>
				<p className="mt-3 body-copy">
					Thank you. We will review your project details and follow up soon.
					{` ${siteConfig.responseExpectation}`}
				</p>
				<p className="mt-4 font-sans text-sm text-stone-muted">
					Need to talk sooner? Call{' '}
					<a className="text-navy underline" href={siteConfig.phones.sr.href}>
						{siteConfig.phones.sr.display}
					</a>
					.
				</p>
			</div>
		)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="relative space-y-5 border border-navy/10 bg-white/80 p-6 sm:p-8"
			noValidate
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<label className="block space-y-2">
					<span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
						Name
					</span>
					<input
						name="name"
						type="text"
						autoComplete="name"
						required
						className="w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
						aria-invalid={Boolean(fieldErrors?.name)}
					/>
					{fieldErrors?.name ? (
						<span className="block text-sm text-red-700">{fieldErrors.name[0]}</span>
					) : null}
				</label>

				<label className="block space-y-2">
					<span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
						Email
					</span>
					<input
						name="email"
						type="email"
						autoComplete="email"
						required
						className="w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
						aria-invalid={Boolean(fieldErrors?.email)}
					/>
					{fieldErrors?.email ? (
						<span className="block text-sm text-red-700">{fieldErrors.email[0]}</span>
					) : null}
				</label>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<label className="block space-y-2">
					<span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
						Phone
					</span>
					<input
						name="phone"
						type="tel"
						autoComplete="tel"
						required
						className="w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
						aria-invalid={Boolean(fieldErrors?.phone)}
					/>
					{fieldErrors?.phone ? (
						<span className="block text-sm text-red-700">{fieldErrors.phone[0]}</span>
					) : null}
				</label>

				<label className="block space-y-2">
					<span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
						Project type
					</span>
					<select
						name="projectType"
						required
						defaultValue=""
						className="w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
						aria-invalid={Boolean(fieldErrors?.projectType)}
					>
						<option value="" disabled>
							Select a type
						</option>
						{projectTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
					{fieldErrors?.projectType ? (
						<span className="block text-sm text-red-700">
							{fieldErrors.projectType[0]}
						</span>
					) : null}
				</label>
			</div>

			<label className="block space-y-2">
				<span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
					Project address
				</span>
				<input
					name="projectAddress"
					type="text"
					autoComplete="street-address"
					placeholder="Street, city, ZIP"
					required
					className="w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
					aria-invalid={Boolean(fieldErrors?.projectAddress)}
				/>
				{fieldErrors?.projectAddress ? (
					<span className="block text-sm text-red-700">
						{fieldErrors.projectAddress[0]}
					</span>
				) : null}
			</label>

			<label className="block space-y-2">
				<span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy">
					Project details
				</span>
				<textarea
					name="message"
					rows={5}
					required
					placeholder="Tell us what you are looking to build or renovate, and we will contact you with a quote."
					className="w-full resize-y border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2"
					aria-invalid={Boolean(fieldErrors?.message)}
				/>
				{fieldErrors?.message ? (
					<span className="block text-sm text-red-700">{fieldErrors.message[0]}</span>
				) : null}
			</label>

			{/* Honeypot */}
			<label className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
				Do not fill this out
				<input
					type="text"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</label>

			{(hasErrored || serverError) && (
				<p className="font-sans text-sm text-red-700" role="alert">
					{serverError ||
						'Something went wrong. Please try again or call us directly.'}
				</p>
			)}

			<button
				type="submit"
				disabled={isExecuting}
				className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
			>
				{isExecuting ? 'Sending…' : 'Request free estimate'}
			</button>

			<p className="font-sans text-xs leading-relaxed text-stone-muted">
				Submissions go to {siteConfig.emails.estimating}. By sending this form
				you agree to our{' '}
				<Link href="/privacy" className="underline underline-offset-2">
					Privacy Policy
				</Link>
				. {siteConfig.responseExpectation}
			</p>
		</form>
	)
}
