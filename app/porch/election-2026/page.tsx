import { PorchElectionView, porchElectionMetadata } from '@/components/porch/election-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export function generateMetadata() {
	return porchElectionMetadata(PORCH_EDITIONS.vero)
}

export default function VeroElectionPage() {
	return <PorchElectionView edition={PORCH_EDITIONS.vero} />
}
