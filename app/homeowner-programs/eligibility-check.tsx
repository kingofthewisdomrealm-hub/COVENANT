'use client'

import { track } from '@vercel/analytics'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'

import { submitProgramCheck } from '@/app/actions/programs'
import { siteConfig } from '@/content/site'

import {
	NEED_OPTIONS,
	PROPERTY_OPTIONS,
	type NeedValue,
	type ProgramMatch,
	type PropertyValue,
} from './eligibility-options'

/**
 * The eligibility check — the capture step that sits ABOVE the Money Map.
 *
 * The map's cards link straight to official government sites, which is the
 * right thing for trust and the wrong thing for a pipeline: a visitor who
 * clicks out is gone. This form is the offer that comes first — "tell us four
 * things and we do the homework" — so the lead lands in the CRM before the
 * visitor ever leaves for a state portal.
 */

const fieldClass =
	'w-full border border-navy/15 bg-stone px-4 py-3 font-sans text-sm text-ink outline-none ring-sand focus:ring-2'
const labelClass =
	'font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy'

export function EligibilityCheck() {
	const [need, setNeed] = useState<NeedValue | ''>('')
	const [property, setProperty] = useState<PropertyValue | ''>('')
	const [matches, setMatches] = useState<ProgramMatch[] | null>(null)

	const { execute, isExecuting, result } = useAction(submitProgramCheck, {
		onSuccess: ({ data }) => {
			if (data?.ok) {
				setMatches(data.matches)
				track('programs_eligibility_submitted')
			}
		},
	})

	const fieldErrors = result.validationErrors?.fieldErrors
	const serverError = result.serverError

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!need || !property) return
		const formData = new FormData(event.currentTarget)
		execute({
			need,
			property,
			zip: String(formData.get('zip') || ''),
			name: String(formData.get('name') || ''),
			email: String(formData.get('email') || ''),
			phone: String(formData.get('phone') || ''),
			projectAddress: String(formData.get('projectAddress') || ''),
			notes: String(formData.get('notes') || ''),
			website: String(formData.get('website') || ''),
		})
	}

	if (matches) {
		return (
			<div
				className="border border-sand/40 bg-white/80 p-8"
				role="status"
				aria-live="polite"
			>
				<h3 className="font-display text-2xl text-navy">
					Here is what likely fits
				</h3>
				<ul className="mt-5 space-y-4">
					{matches.map((match) => (
						<li key={match.name} className="border-l-2 border-sand pl-4">
							<p className="font-sans text-sm font-semibold text-navy">
								{match.name}
							</p>
							<p className="mt-1 body-copy text-sm">{match.pays}.</p>
							<p className="mt-1 font-sans text-sm text-stone-muted">
								{match.note}
							</p>
						</li>
					))}
				</ul>
				<p className="mt-6 body-copy text-sm">
					We sent this list to your email and we will reach out shortly.
					&ldquo;Likely&rdquo; is the honest word — each program makes the final
					call, and funding opens and closes in waves. Checking the current
					status and doing the paperwork with you is the part we handle, free.
				</p>
				<p className="mt-4 font-sans text-sm text-stone-muted">
					Want to talk now? Call{' '}
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
			className="space-y-6 border border-sand/40 bg-white/80 p-8"
		>
			<div className="space-y-3">
				<span className={labelClass}>What does your property need?</span>
				<div className="grid gap-3 sm:grid-cols-2">
					{NEED_OPTIONS.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => setNeed(option.value)}
							aria-pressed={need === option.value}
							className={`min-h-[44px] border px-4 py-3 text-left font-sans text-sm transition-colors ${
								need === option.value
									? 'border-navy bg-navy text-white'
									: 'border-navy/15 bg-stone text-ink hover:border-navy/40'
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
				{fieldErrors?.need ? (
					<p className="font-sans text-sm text-red-700">{fieldErrors.need[0]}</p>
				) : null}
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="space-y-2">
					<label className={labelClass} htmlFor="eligibility-property">
						Property type
					</label>
					<select
						id="eligibility-property"
						className={fieldClass}
						value={property}
						onChange={(event) =>
							setProperty(event.target.value as PropertyValue)
						}
					>
						<option value="" disabled>
							Choose one
						</option>
						{PROPERTY_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{fieldErrors?.property ? (
						<p className="font-sans text-sm text-red-700">
							{fieldErrors.property[0]}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className={labelClass} htmlFor="eligibility-zip">
						Property ZIP code
					</label>
					<input
						id="eligibility-zip"
						name="zip"
						inputMode="numeric"
						maxLength={5}
						placeholder="34950"
						className={fieldClass}
					/>
					{fieldErrors?.zip ? (
						<p className="font-sans text-sm text-red-700">{fieldErrors.zip[0]}</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="space-y-2">
					<label className={labelClass} htmlFor="eligibility-name">
						Your name
					</label>
					<input id="eligibility-name" name="name" className={fieldClass} />
					{fieldErrors?.name ? (
						<p className="font-sans text-sm text-red-700">
							{fieldErrors.name[0]}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className={labelClass} htmlFor="eligibility-phone">
						Phone
					</label>
					<input
						id="eligibility-phone"
						name="phone"
						type="tel"
						className={fieldClass}
					/>
					{fieldErrors?.phone ? (
						<p className="font-sans text-sm text-red-700">
							{fieldErrors.phone[0]}
						</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="space-y-2">
					<label className={labelClass} htmlFor="eligibility-email">
						Email
					</label>
					<input
						id="eligibility-email"
						name="email"
						type="email"
						className={fieldClass}
					/>
					{fieldErrors?.email ? (
						<p className="font-sans text-sm text-red-700">
							{fieldErrors.email[0]}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className={labelClass} htmlFor="eligibility-address">
						Property address
					</label>
					<input
						id="eligibility-address"
						name="projectAddress"
						className={fieldClass}
					/>
					{fieldErrors?.projectAddress ? (
						<p className="font-sans text-sm text-red-700">
							{fieldErrors.projectAddress[0]}
						</p>
					) : null}
				</div>
			</div>

			<div className="space-y-2">
				<label className={labelClass} htmlFor="eligibility-notes">
					Anything else we should know? (optional)
				</label>
				<textarea
					id="eligibility-notes"
					name="notes"
					rows={2}
					className={fieldClass}
				/>
			</div>

			{/* Honeypot — humans never see it, bots fill it. */}
			<div className="hidden" aria-hidden="true">
				<label htmlFor="eligibility-website">Website</label>
				<input
					id="eligibility-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{serverError ? (
				<p className="font-sans text-sm text-red-700" role="alert">
					{serverError}
				</p>
			) : null}

			<div className="flex flex-wrap items-center gap-4">
				<button
					type="submit"
					disabled={isExecuting || !need || !property}
					className="rounded-full bg-navy px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isExecuting ? 'Checking…' : 'Check what I qualify for'}
				</button>
				<p className="font-sans text-xs text-stone-muted">
					Free. No obligation. We never charge for pointing the way.
				</p>
			</div>
		</form>
	)
}
