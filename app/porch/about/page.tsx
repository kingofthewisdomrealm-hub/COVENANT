import { PorchAboutView, porchAboutMetadata } from '@/components/porch/about-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

export const metadata = porchAboutMetadata(PORCH_EDITIONS.vero)

export default function VeroAboutPage() {
	return <PorchAboutView edition={PORCH_EDITIONS.vero} />
}
