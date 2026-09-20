import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The assistant's doors into the CRM database.
 *
 * Every call goes through a SECURITY DEFINER function in
 * supabase/assistant/001_assistant.sql that checks the assistant secret
 * first. The site only ever holds the publishable (anon) key — same model as
 * lib/crm.ts and the attribution page. Never put the service-role key here.
 */

export type Building = {
	id: string
	name: string
	city: string | null
	address: string | null
	stories: number | null
	year_built: number | null
	deadline: string | null
	status: string
	contact: string | null
	phone: string | null
	called: boolean
	notes: string | null
	lead_project_id: string | null
	source: string | null
}

export type Program = {
	id: string
	name: string
	scope: string | null
	bucket: string | null
	summary: string | null
	access: string[]
	contact: { label: string; href?: string }[]
	status: string | null
	sort_order: number
}

export type Knowledge = { topic: string; body: string; source: string | null }

export type Lead = {
	id: string
	created_at: string
	building_id: string | null
	building: string
	city: string | null
	deadline: string | null
	contact: string | null
	phone: string | null
	reason: string | null
	next_step: string | null
	project_id: string | null
	crm_error: string | null
}

export function assistantSecret(): string | null {
	const s = process.env.ASSISTANT_SECRET?.trim()
	return s && s.length >= 12 ? s : null
}

export function isAssistantConfigured() {
	return Boolean(
		process.env.SUPABASE_URL &&
			process.env.SUPABASE_PUBLISHABLE_KEY &&
			process.env.ANTHROPIC_API_KEY &&
			assistantSecret()
	)
}

let client: SupabaseClient | null = null
function supabase() {
	const url = process.env.SUPABASE_URL
	const key = process.env.SUPABASE_PUBLISHABLE_KEY
	if (!url || !key) throw new Error('CRM not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY).')
	if (!client) client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
	return client
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
	const { data, error } = await supabase().rpc(fn, args)
	if (error) throw new Error(`${fn}: ${error.message}`)
	return data as T
}

export const db = {
	buildings: (key: string) => rpc<Building[]>('assistant_buildings', { p_key: key }),
	programs: (key: string) => rpc<Program[]>('assistant_programs', { p_key: key }),
	knowledge: (key: string, topic?: string) =>
		rpc<Knowledge[]>('assistant_knowledge_get', { p_key: key, p_topic: topic ?? null }),
	leads: (key: string) => rpc<Lead[]>('assistant_leads_list', { p_key: key }),
	upsertBuildings: (key: string, rows: unknown[], replace: boolean) =>
		rpc<number>('assistant_upsert_buildings', { p_key: key, p_rows: rows, p_replace: replace }),
	recordLead: (
		key: string,
		buildingId: string,
		reason: string,
		nextStep: string,
		projectId: string | null,
		crmError: string | null
	) =>
		rpc<string>('assistant_record_lead', {
			p_key: key,
			p_building_id: buildingId,
			p_reason: reason,
			p_next_step: nextStep,
			p_project_id: projectId,
			p_crm_error: crmError,
		}),
	logRun: (key: string, goal: string, report: string, tools: string[]) =>
		rpc<null>('assistant_log_run', { p_key: key, p_goal: goal, p_report: report, p_tools: tools }).catch(
			() => null
		),
}
