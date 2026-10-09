/**
 * PHOTO ESTIMATOR — WHAT WE ESTIMATE AND WHAT WE ASK.
 *
 * This is the file to edit to add, rename, or turn off a service.
 *
 *   enabled: false   → the category disappears from the page and the AI is
 *                      told not to pick it.
 *   scopes           → the kinds of job inside a category. Each scope has the
 *                      questions the customer is asked before pricing.
 *
 * A category with no entry in content/estimator/pricebook.ts still works: the
 * customer gets the photo read-out and lead capture, and the price line says
 * "priced after a quick look." Nothing is ever priced without a pricebook row.
 *
 * Plain words: catalog = the menu. pricebook = the prices. engine = the math.
 */

export type QuestionOption = { value: string; label: string }

export type Question = {
	id: string
	label: string
	help?: string
	type: 'number' | 'select'
	unit?: string
	min?: number
	max?: number
	options?: QuestionOption[]
	/** Required to produce a price. Missing → engine asks for an inspection. */
	required?: boolean
}

export type Scope = {
	id: string
	label: string
	/** Plain-English description handed to the AI so it can pick a scope. */
	aiHint: string
	questions: Question[]
}

export type Category = {
	id: string
	label: string
	enabled: boolean
	/** Shown to the AI so it knows what belongs here. */
	aiHint: string
	scopes: Scope[]
	/** Roofing / storm copy rules apply (F.S. 489.147). */
	roofAd?: boolean
}

const stories: Question = {
	id: 'stories',
	label: 'How many stories is the building?',
	type: 'select',
	required: true,
	options: [
		{ value: '1', label: '1 story' },
		{ value: '2', label: '2 stories' },
		{ value: '3', label: '3 stories' },
	],
}

const pitch: Question = {
	id: 'pitch',
	label: 'How steep is the roof?',
	help: 'Could you walk on it comfortably? That is "standard." If not, it is "steep."',
	type: 'select',
	required: true,
	options: [
		{ value: 'low', label: 'Nearly flat' },
		{ value: 'standard', label: 'Standard' },
		{ value: 'steep', label: 'Steep' },
		{ value: 'unknown', label: 'Not sure' },
	],
}

const homeSqft: Question = {
	id: 'homeSqft',
	label: 'About how big is the home?',
	help: 'Living area in square feet — it is on your property appraiser record.',
	type: 'number',
	unit: 'sq ft',
	min: 300,
	max: 12000,
	required: true,
}

const yesNo = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' },
]

export const categories: Category[] = [
	{
		id: 'roofing',
		label: 'Roofing',
		enabled: true,
		roofAd: true,
		aiHint: 'Roof coverings: shingles, tile, metal, flat roofs, flashing, roof leaks, missing or lifted shingles.',
		scopes: [
			{
				id: 'roof-repair',
				label: 'Roof repair',
				aiHint: 'A few damaged, missing, or leaking spots on an otherwise sound roof.',
				questions: [
					{
						id: 'repairAreas',
						label: 'How many separate damaged spots?',
						help: 'Count each area about the size of a door or smaller as one spot.',
						type: 'number',
						min: 1,
						max: 10,
						required: true,
					},
					stories,
					pitch,
				],
			},
			{
				id: 'roof-replace',
				label: 'Roof replacement',
				aiHint: 'Roof is worn out, widespread damage, or the owner wants a new roof.',
				questions: [
					homeSqft,
					stories,
					pitch,
					{
						id: 'garageBays',
						label: 'Attached garage under the same roof?',
						type: 'select',
						required: true,
						options: [
							{ value: '0', label: 'No garage' },
							{ value: '1', label: '1-car' },
							{ value: '2', label: '2-car' },
							{ value: '3', label: '3-car' },
						],
					},
				],
			},
		],
	},
	{
		id: 'drywall',
		label: 'Drywall',
		enabled: true,
		aiHint: 'Interior walls and ceilings: holes, cracks, water stains, new walls, patching, finishing.',
		scopes: [
			{
				id: 'drywall-patch',
				label: 'Patch holes or damage',
				aiHint: 'Holes, dents, cracks, or small water-damaged sections in existing drywall.',
				questions: [
					{ id: 'smallHoles', label: 'Small holes (smaller than your hand)', type: 'number', min: 0, max: 50, required: true },
					{ id: 'mediumHoles', label: 'Medium holes (up to about 2 feet)', type: 'number', min: 0, max: 30, required: true },
					{ id: 'largeHoles', label: 'Large sections (bigger than 2 feet)', type: 'number', min: 0, max: 20, required: true },
					{
						id: 'texture',
						label: 'What does the wall surface look like?',
						type: 'select',
						required: true,
						options: [
							{ value: 'smooth', label: 'Smooth' },
							{ value: 'textured', label: 'Textured (orange peel, knockdown)' },
							{ value: 'unknown', label: 'Not sure' },
						],
					},
					{ id: 'paintTouchup', label: 'Paint the patched areas too?', type: 'select', required: true, options: yesNo },
				],
			},
			{
				id: 'drywall-install',
				label: 'New or replaced drywall',
				aiHint: 'Whole walls or rooms of new drywall, or removal and replacement of large areas.',
				questions: [
					{ id: 'length', label: 'Room length', type: 'number', unit: 'ft', min: 3, max: 80, required: true },
					{ id: 'width', label: 'Room width', type: 'number', unit: 'ft', min: 3, max: 80, required: true },
					{ id: 'height', label: 'Ceiling height', type: 'number', unit: 'ft', min: 7, max: 20, required: true },
					{ id: 'includeCeiling', label: 'Include the ceiling?', type: 'select', required: true, options: yesNo },
					{ id: 'removeOld', label: 'Remove old drywall first?', type: 'select', required: true, options: yesNo },
				],
			},
		],
	},
	{
		id: 'painting',
		label: 'Painting',
		enabled: true,
		aiHint: 'Interior or exterior paint: peeling, faded, stained, or a color change.',
		scopes: [
			{
				id: 'paint-interior',
				label: 'Interior painting',
				aiHint: 'Inside walls, ceilings, trim.',
				questions: [
					{ id: 'rooms', label: 'How many rooms?', type: 'number', min: 1, max: 30, required: true },
					{ id: 'length', label: 'Typical room length', type: 'number', unit: 'ft', min: 4, max: 60, required: true },
					{ id: 'width', label: 'Typical room width', type: 'number', unit: 'ft', min: 4, max: 60, required: true },
					{ id: 'height', label: 'Ceiling height', type: 'number', unit: 'ft', min: 7, max: 20, required: true },
					{ id: 'includeCeilings', label: 'Paint the ceilings too?', type: 'select', required: true, options: yesNo },
					{ id: 'includeTrim', label: 'Paint doors and trim too?', type: 'select', required: true, options: yesNo },
				],
			},
			{
				id: 'paint-exterior',
				label: 'Exterior painting',
				aiHint: 'Outside walls of the house.',
				questions: [
					homeSqft,
					stories,
					{
						id: 'surface',
						label: 'What are the outside walls?',
						type: 'select',
						required: true,
						options: [
							{ value: 'stucco', label: 'Stucco / block' },
							{ value: 'siding', label: 'Wood or fiber-cement siding' },
							{ value: 'other', label: 'Other / not sure' },
						],
					},
				],
			},
		],
	},
	{
		id: 'flooring',
		label: 'Flooring',
		enabled: true,
		aiHint: 'Floors: tile, vinyl plank, laminate, hardwood, carpet replacement.',
		scopes: [
			{
				id: 'flooring',
				label: 'New flooring',
				aiHint: 'Install new flooring, replacing what is there now.',
				questions: [
					{
						id: 'floorType',
						label: 'What do you want installed?',
						type: 'select',
						required: true,
						options: [
							{ value: 'vinyl', label: 'Vinyl plank' },
							{ value: 'laminate', label: 'Laminate' },
							{ value: 'tile', label: 'Tile' },
							{ value: 'hardwood', label: 'Engineered hardwood' },
						],
					},
					{ id: 'area', label: 'Floor area', help: 'Length × width of each room, added up.', type: 'number', unit: 'sq ft', min: 20, max: 6000, required: true },
					{
						id: 'remove',
						label: 'What is on the floor now?',
						type: 'select',
						required: true,
						options: [
							{ value: 'none', label: 'Bare slab / nothing' },
							{ value: 'carpet', label: 'Carpet' },
							{ value: 'vinyl', label: 'Vinyl or laminate' },
							{ value: 'tile', label: 'Tile' },
						],
					},
				],
			},
		],
	},
	{ id: 'fencing', label: 'Fencing', enabled: true, aiHint: 'Wood, vinyl, or aluminum fences and gates.', scopes: [{ id: 'fence', label: 'Fence repair or new fence', aiHint: 'Any fence work.', questions: [] }] },
	{ id: 'doors-windows', label: 'Doors & windows', enabled: true, aiHint: 'Exterior or interior doors, windows, sliders, impact windows.', scopes: [{ id: 'doors-windows', label: 'Repair or replace', aiHint: 'Any door or window work.', questions: [] }] },
	{ id: 'siding', label: 'Siding, soffit & fascia', enabled: true, aiHint: 'Exterior siding, soffits, fascia boards, rotted trim.', scopes: [{ id: 'siding', label: 'Repair or replace', aiHint: 'Any siding, soffit, or fascia work.', questions: [] }] },
	{ id: 'gutters', label: 'Gutters & downspouts', enabled: true, aiHint: 'Gutters and downspouts.', scopes: [{ id: 'gutters', label: 'Repair or replace', aiHint: 'Any gutter work.', questions: [] }] },
	{ id: 'decks-patios', label: 'Decks & patios', enabled: true, aiHint: 'Wood or composite decks, patios, pavers, screen rooms.', scopes: [{ id: 'decks-patios', label: 'Repair or build', aiHint: 'Any deck or patio work.', questions: [] }] },
	{ id: 'concrete', label: 'Concrete & masonry', enabled: true, aiHint: 'Concrete slabs, driveways, spalling, block walls, stucco cracks.', scopes: [{ id: 'concrete', label: 'Repair or pour', aiHint: 'Any concrete or masonry work.', questions: [] }] },
	{ id: 'remodel', label: 'Remodeling & handyman', enabled: true, aiHint: 'Kitchens, bathrooms, general repairs, anything else.', scopes: [{ id: 'remodel', label: 'Remodel or repair', aiHint: 'Any other project.', questions: [] }] },
]

export const enabledCategories = () => categories.filter((c) => c.enabled)

export function findScope(categoryId: string, scopeId: string) {
	const category = categories.find((c) => c.id === categoryId && c.enabled)
	const scope = category?.scopes.find((s) => s.id === scopeId)
	return category && scope ? { category, scope } : null
}

/** Questions every estimate asks regardless of scope. */
export const zipQuestion: Question = {
	id: 'zip',
	label: 'Project ZIP code',
	type: 'number',
	required: true,
}

export const tierCopy = {
	budget: { label: 'Budget', blurb: 'Economical materials, basic scope.' },
	standard: { label: 'Standard', blurb: 'Typical materials, professional installation.' },
	premium: { label: 'Premium', blurb: 'Higher-end materials and finishes.' },
} as const
