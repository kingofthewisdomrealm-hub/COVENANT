import { PorchArchiveView, porchArchiveMetadata } from '@/components/porch/archive-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const metadata = porchArchiveMetadata(PORCH_EDITIONS.sebastian)

export default function SebastianPorchArchivePage() {
	return <PorchArchiveView edition={PORCH_EDITIONS.sebastian} />
}
