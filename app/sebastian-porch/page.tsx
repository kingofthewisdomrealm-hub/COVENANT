import { PorchFrontPage, porchFrontMetadata } from '@/components/porch/front-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const metadata = porchFrontMetadata(PORCH_EDITIONS.sebastian)

export default function SebastianPorchPage() {
	return <PorchFrontPage edition={PORCH_EDITIONS.sebastian} />
}
