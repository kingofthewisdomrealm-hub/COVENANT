import { PorchElectionView, porchElectionMetadata } from '@/components/porch/election-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export function generateMetadata() {
	return porchElectionMetadata(PORCH_EDITIONS.sebastian)
}

export default function SebastianElectionPage() {
	return <PorchElectionView edition={PORCH_EDITIONS.sebastian} />
}
