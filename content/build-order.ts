/**
 * Build-order game content — /play.
 *
 * Two levels. Each is a sequence the player must reassemble. The order is
 * the real one:
 *  - Roof: Indian River County re-roof inspection checkpoints (sheathing →
 *    dry-in → flashing → in-progress → final) over FBC 8th edition practice.
 *  - House: Florida Building Code required residential inspections
 *    (foundation → framing/sheathing → dry-in → rough-ins → final) over a
 *    standard Treasure Coast CBS build.
 *
 * PUBLIC COPY ONLY. No dollar figures, no insurance-claim language
 * (F.S. §489.147 / §626.854(16)). It is a game, not a permit — the footer says so.
 */

export interface BuildStep {
	id: string
	title: string
	detail: string
	/** Shown when the player tries this step before the one that is actually next. */
	leakLine: string
	/** Which drawing layer this step reveals. */
	layer?: string
	/** Inspection that stamps PASS after this step. */
	inspection?: string
}

export interface BuildLevel {
	key: 'roof' | 'house'
	name: string
	pickLabel: string
	sceneLabel: string
	intro: string
	firstHint: string
	footnote: string
	/** Index 0 = three stars, 1 = two, 2 = one. */
	winTitles: [string, string, string]
	winBody: string
	ctaLabel: string
	steps: BuildStep[]
}

export const buildLevels: BuildLevel[] = [
	{
		key: 'roof',
		name: 'Roof Raiser',
		pickLabel: 'Put on a roof',
		sceneLabel: 'Your roof',
		intro:
			'Put the roof on in the right order. Skip a step and it leaks — same as real life, just cheaper. Drag a card onto the roof, or tap it.',
		firstHint:
			'Start with what a real contractor does first. (Hint: it is paperwork.)',
		footnote:
			'Step order reflects Florida Building Code re-roof practice and Indian River County inspection checkpoints (sheathing → dry-in → flashing → in-progress → final). A game, not a permit.',
		winTitles: [
			'Perfect roof. Zero leaks. Are you hiring?',
			'Passed final — with a couple of wet spots.',
			'It passed. Eventually. Your attic has a pool now.',
		],
		winBody:
			'That was 8 steps and 5 county inspections. A real Treasure Coast re-roof goes in the same order — we just bring the nail guns. Want to see how yours would go?',
		ctaLabel: 'Plan my real roof',
		steps: [
			{
				id: 'permit',
				title: 'Pull the permit',
				detail:
					'The county needs to know. No permit means no inspections, and your insurer will want to see those.',
				leakLine:
					'No permit, no inspections. Now the roof has to come back off to prove the nailing.',
			},
			{
				id: 'tearoff',
				title: 'Tear off the old roof',
				detail: 'Down to bare wood. Never roof over rotten material.',
				leakLine:
					'You buried bad wood under new shingles. It rots from the inside. Surprise.',
				layer: 'tearoff',
			},
			{
				id: 'deck',
				title: 'Re-nail the deck',
				detail: '8d ring-shank nails every 6 inches. Inspection 1: sheathing.',
				leakLine:
					'The deck is not nailed to code. A hurricane peels plywood like a banana.',
				layer: 'deck',
				inspection: 'Inspection 1 · Sheathing',
			},
			{
				id: 'eave',
				title: 'Drip edge at the eaves',
				detail: 'A metal lip so water drops off instead of wicking back into the wood.',
				leakLine:
					'Water wicks back under the edge and rots the fascia. Your gutter guy hates you.',
				layer: 'eave',
			},
			{
				id: 'barrier',
				title: 'Peel-and-stick water barrier',
				detail:
					'Self-adhered membrane over the whole deck. Inspection 2: dry-in.',
				leakLine:
					'No secondary water barrier. Shingles blow off, rain pours straight in.',
				layer: 'barrier',
				inspection: 'Inspection 2 · Dry-in',
			},
			{
				id: 'flashing',
				title: 'Flash pipes, valleys and walls',
				detail: 'Metal at every hole and every joint. Inspection 3: flashing.',
				leakLine:
					'Every pipe and wall joint is now an open faucet into your attic.',
				layer: 'flashing',
				inspection: 'Inspection 3 · Flashing',
			},
			{
				id: 'shingles',
				title: 'Shingles — six nails each',
				detail: 'Florida wants six, not four. Inspection 4: in-progress.',
				leakLine:
					'Nothing on top yet. That membrane is not rated to sit in the sun.',
				layer: 'shingles',
				inspection: 'Inspection 4 · In-progress',
			},
			{
				id: 'ridge',
				title: 'Ridge vent and clean-up',
				detail: 'Let the attic breathe, pick up every nail. Inspection 5: final.',
				leakLine:
					'The attic cannot breathe and the yard is full of nails. Final fails.',
				layer: 'ridge',
				inspection: 'Inspection 5 · Final',
			},
		],
	},
	{
		key: 'house',
		name: 'House Raiser',
		pickLabel: 'Build a house',
		sceneLabel: 'Your house',
		intro:
			'Build a Florida block house from dirt to keys. Get the order wrong and you are pouring concrete on top of your own plumbing. Drag a card onto the house, or tap it.',
		firstHint:
			'Same rule as the roof: before anyone touches a shovel, somebody has to sign something.',
		footnote:
			'Step order reflects Florida Building Code required inspections (foundation → framing and sheathing → dry-in → rough-ins → final) and standard Treasure Coast concrete-block construction. A game, not a permit.',
		winTitles: [
			'Flawless. Dirt to keys, zero leaks. We should talk.',
			'Certificate of Occupancy — with a few do-overs.',
			'It got a CO. The inspector aged five years.',
		],
		winBody:
			'Ten steps, five inspections, one Certificate of Occupancy. A real custom home on the Treasure Coast runs the same order over several months. Want to start yours?',
		ctaLabel: 'Plan my real house',
		steps: [
			{
				id: 'plans',
				title: 'Plans, survey and permit',
				detail: 'Engineered plans, a lot survey, and the county sign-off.',
				leakLine:
					'You built on a guess. No permit, no inspections, and the county makes you tear it out.',
				layer: 'lot',
			},
			{
				id: 'footers',
				title: 'Dig and pour the footers',
				detail: 'Trenches, rebar, concrete. Inspection 1: foundation.',
				leakLine:
					'Nothing to stand on yet. The walls sink into the sand like a beach umbrella.',
				layer: 'footers',
				inspection: 'Inspection 1 · Foundation',
			},
			{
				id: 'slab',
				title: 'Under-slab plumbing, termite treatment, pour the slab',
				detail: 'Pipes go in the dirt first. Then the concrete seals everything.',
				leakLine:
					'You poured the slab with no pipes under it. Jackhammer time.',
				layer: 'slab',
			},
			{
				id: 'block',
				title: 'Lay the block walls',
				detail: 'Concrete block with rebar and poured cells. Florida’s favorite.',
				leakLine:
					'Walls need a slab to sit on. Block on dirt is a very expensive pile.',
				layer: 'block',
			},
			{
				id: 'beam',
				title: 'Pour the tie beam',
				detail:
					'A concrete beam that locks the walls together and holds the roof down.',
				leakLine:
					'No tie beam means the trusses have nothing to strap to. First storm, the roof goes flying.',
				layer: 'beam',
			},
			{
				id: 'trusses',
				title: 'Set trusses and sheathing',
				detail: 'Crane day. Straps, sheathing, nailed to code. Inspection 2: framing.',
				leakLine:
					'Trusses straight onto block? No — the tie beam is what they strap to.',
				layer: 'trusses',
				inspection: 'Inspection 2 · Framing and sheathing',
			},
			{
				id: 'dryin',
				title: 'Dry-in, windows and doors',
				detail:
					'Roof membrane, impact windows, exterior doors. Now it is watertight. Inspection 3.',
				leakLine:
					'The house is not closed in yet. Rain on drywall makes papier-mâché.',
				layer: 'dryin',
				inspection: 'Inspection 3 · Dry-in',
			},
			{
				id: 'rough',
				title: 'Rough-ins: electric, plumbing, A/C',
				detail:
					'Wires, pipes and ducts while the walls are still open. Inspection 4.',
				leakLine:
					'The inspector needs to see every wire and pipe before anything gets covered.',
				layer: 'rough',
				inspection: 'Inspection 4 · Rough-ins',
			},
			{
				id: 'drywall',
				title: 'Insulation and drywall',
				detail: 'Now the walls can close. Mud, tape, texture.',
				leakLine:
					'You just hid the wires before the inspector saw them. Cut it all open again.',
				layer: 'drywall',
			},
			{
				id: 'co',
				title: 'Finishes, final, Certificate of Occupancy',
				detail:
					'Roof covering, paint, cabinets, floors, sod. Inspection 5: final. Keys.',
				leakLine:
					'Pretty finishes on an unfinished house. Nobody can live in it yet.',
				layer: 'co',
				inspection: 'Inspection 5 · Final · CO',
			},
		],
	},
]
