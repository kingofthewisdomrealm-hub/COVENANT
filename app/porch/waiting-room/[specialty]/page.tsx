import { WaitingRoomView, waitingRoomMetadata, waitingRoomParams } from '@/components/porch/waiting-room-page'
import { PORCH_EDITIONS } from '@/lib/porch-editions'

const ed = PORCH_EDITIONS.vero

export const dynamicParams = false

export function generateStaticParams() {
	return waitingRoomParams()
}

export function generateMetadata({ params }: { params: { specialty: string } }) {
	return waitingRoomMetadata(ed, params.specialty)
}

export default function PorchWaitingRoomPage({ params }: { params: { specialty: string } }) {
	return <WaitingRoomView edition={ed} specialty={params.specialty} />
}
