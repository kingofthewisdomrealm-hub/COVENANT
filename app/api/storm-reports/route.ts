import { NextResponse } from 'next/server'

import { stormEventsForZip } from '@/lib/storm-reports'

export const revalidate = 3600

export async function GET(request: Request) {
	const zip = new URL(request.url).searchParams.get('zip') || ''
	if (!/^\d{5}$/.test(zip)) {
		return NextResponse.json(
			{ events: [], error: 'Enter a 5-digit ZIP.' },
			{ status: 400 }
		)
	}

	const events = await stormEventsForZip(zip)
	return NextResponse.json({
		zip,
		events,
		source:
			'National Weather Service Local Storm Reports via Iowa Environmental Mesonet',
	})
}
