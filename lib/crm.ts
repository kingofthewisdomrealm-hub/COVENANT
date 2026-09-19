import { createClient } from '@supabase/supabase-js'

import type { ValidAttribution } from '@/lib/attribution/shared'

/**
 * Writes website enquiries into the Covenant Builders CRM.
 *
 * SECURITY MODEL
 * This uses the Supabase *publishable* (anon) key, never the service-role key.
 * Anon has no direct insert rights on `projects` or `contacts`. Its only way in
 * is the `submit_website_lead` SECURITY DEFINER function, which validates and
 * caps its inputs and returns nothing but the new project id.
 *
 * If someone ever proposes putting SUPABASE_SERVICE_ROLE_KEY in this app to
 * "make it simpler": don't. That key bypasses row-level security entirely, and
 * this is a public marketing site.
 */

export type CrmLeadInput = {
	name: string
	email: string
	phone: string
	projectAddress: string
	/** Website slug — mapped to the job_category enum inside the RPC. */
	projectType: string
	message: string
	/** Where the lead came from. Optional — never required to create a lead. */
	attribution?: ValidAttribution
	/** Which form produced it: contact | design | programs | storm_check */
	formName?: string
}

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY

/** True when the CRM connection is configured. Lets the form degrade quietly. */
export function isCrmConfigured() {
	return Boolean(url && key)
}

/**
 * Creates a contact + a job at the Lead milestone.
 *
 * Returns the new project id, or null if the CRM is not configured.
 * THROWS on a genuine failure — the caller is expected to catch it and still
 * send the notification email. A database problem must never cost a lead.
 */
export async function createCrmLead(
	input: CrmLeadInput
): Promise<string | null> {
	if (!url || !key) {
		console.warn('CRM not configured — skipping lead write')
		return null
	}

	const supabase = createClient(url, key, {
		auth: { persistSession: false, autoRefreshToken: false },
	})

	const { data, error } = await supabase.rpc('submit_website_lead', {
		p_name: input.name,
		p_email: input.email,
		p_phone: input.phone,
		p_address: input.projectAddress,
		p_category: input.projectType,
		p_message: input.message,
	})

	if (error) {
		throw new Error(`CRM write failed: ${error.message}`)
	}

	const projectId = (data as string | null) ?? null

	/**
	 * Attribution rides in a SECOND call so it can never cost the lead: if the
	 * `record_lead_attribution` function is missing (SQL not run yet) or fails,
	 * the lead is already saved and the email still carries the attribution.
	 */
	if (projectId) {
		await recordLeadAttribution(supabase, projectId, input).catch((attrError) =>
			console.error('CRM attribution write failed (lead itself is saved):', attrError)
		)
	}

	return projectId
}

async function recordLeadAttribution(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- hand-made RPC, not in generated types
	supabase: any,
	projectId: string,
	input: CrmLeadInput
) {
	const a = input.attribution
	const { error } = await supabase.rpc('record_lead_attribution', {
		p_project_id: projectId,
		p_form: input.formName ?? 'contact',
		p_payload: a ?? {},
	})
	if (error) throw new Error(error.message)
}
