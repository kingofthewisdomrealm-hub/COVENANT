import { NextResponse, type NextRequest } from 'next/server'

import { assistantSecret, db } from '@/lib/assistant/db'
import type { Proposal } from '@/lib/assistant/tools'
import { createCrmLead } from '@/lib/crm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The human checkpoint, made real.
 *
 *   POST /api/assistant/approve   { key, proposal }
 *
 * Only a click on "add it" reaches here — Claude cannot call this route. It
 * writes the lead the same way the website forms do (submit_website_lead:
 * a contact + a job at the Lead milestone), then records it in
 * assistant_leads with the CRM job id. If the CRM write fails, the lead is
 * still recorded with the error, so nothing is lost.
 */
export async function POST(req: NextRequest) {
	const secret = assistantSecret()
	const body = (await req.json().catch(() => null)) as { key?: string; proposal?: Proposal } | null
	if (!secret || !body || body.key !== secret) return NextResponse.json({ error: 'not found' }, { status: 404 })
	const p = body.proposal
	if (!p || !p.building_id || !p.name) return NextResponse.json({ error: 'Missing proposal.' }, { status: 400 })

	const message = [
		'[COVENANT ASSISTANT — MILESTONE OUTREACH LEAD]',
		'',
		`Building: ${p.name}${p.city ? `, ${p.city}` : ''}${p.stories ? ` · ${p.stories} stories` : ''}`,
		`Milestone deadline: ${p.deadline ?? 'needs manual lookup'}`,
		`Board contact: ${p.contact ?? 'needs manual lookup'}${p.phone ? ` · ${p.phone}` : ''}`,
		'',
		`Why now: ${p.reason}`,
		p.next_step ? `Next step: ${p.next_step}` : '',
		'',
		'Approved by a human in the Covenant Assistant.',
	]
		.filter((line) => line !== '')
		.join('\n')

	let projectId: string | null = null
	let crmError: string | null = null
	try {
		projectId = await createCrmLead({
			formName: 'contact',
			name: p.contact || `${p.name} board`,
			email: '',
			phone: p.phone || '',
			projectAddress: `${p.name}${p.city ? `, ${p.city}` : ''}`,
			projectType: 'commercial', // condo/association work rides in as commercial (see app/actions/design.ts)
			message,
		})
		if (!projectId) crmError = 'CRM not configured'
	} catch (err) {
		crmError = err instanceof Error ? err.message : String(err)
	}

	try {
		const leadId = await db.recordLead(secret, p.building_id, p.reason, p.next_step, projectId, crmError)
		return NextResponse.json({ ok: true, lead_id: leadId, project_id: projectId, crm_error: crmError })
	} catch (err) {
		return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
	}
}
