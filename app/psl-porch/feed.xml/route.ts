import { porchFeedResponse } from '@/lib/porch-feed'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const dynamic = 'force-static'

export function GET() {
	return porchFeedResponse(PORCH_EDITIONS.psl)
}
