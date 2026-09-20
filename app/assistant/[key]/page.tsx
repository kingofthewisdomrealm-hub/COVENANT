/**
 * PRIVATE Covenant Assistant on the website.
 *
 *   covenantbuilders.org/assistant/<ASSISTANT_SECRET>
 *
 * Same lock as the attribution page: no login box, the key in the address IS
 * the lock. The page 404s for any other key, robots are told to stay away,
 * nothing links here. Share the link only with people allowed to add leads.
 *
 * Claude thinks on the server (app/api/assistant), reads the CRM through
 * key-checked Supabase functions (supabase/assistant/001_assistant.sql), and
 * can only propose a lead — a human click on "add it" is what writes it.
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { assistantSecret, isAssistantConfigured } from '@/lib/assistant/db'
import { MODELS } from '@/lib/assistant/tools'

import { AssistantClient } from './assistant-client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
	title: 'Assistant',
	robots: { index: false, follow: false, nocache: true },
}

export default function AssistantPage({ params }: { params: { key: string } }) {
	const secret = assistantSecret()
	if (!secret || params.key !== secret) notFound()
	const missing = [
		!process.env.SUPABASE_URL && 'SUPABASE_URL',
		!process.env.SUPABASE_PUBLISHABLE_KEY && 'SUPABASE_PUBLISHABLE_KEY',
		!process.env.ANTHROPIC_API_KEY && 'ANTHROPIC_API_KEY',
	].filter(Boolean) as string[]
	return <AssistantClient secret={secret} configured={isAssistantConfigured()} missing={missing} models={MODELS.map((m) => ({ ...m }))} />
}
