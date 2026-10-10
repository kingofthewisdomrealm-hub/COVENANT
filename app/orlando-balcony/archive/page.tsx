import { PorchArchiveView, porchArchiveMetadata } from '@/components/porch/archive-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const metadata = porchArchiveMetadata(PORCH_EDITIONS.orlando)

export default function OrlandoBalconyArchivePage() {
	return <PorchArchiveView edition={PORCH_EDITIONS.orlando} />
}
