import { createSafeActionClient } from 'next-safe-action'

export const actionClient = createSafeActionClient({
	handleServerError(error) {
		console.error('Server action error:', error)
		return 'Something went wrong. Please try again or call us directly.'
	},
	defaultValidationErrorsShape: 'flattened',
})
