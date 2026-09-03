/**
 * FAQ content.
 *
 * Every answer here must already be true and visible elsewhere on the page it
 * is attached to — these arrays feed BOTH the visible <Faq> section and the
 * FAQPage JSON-LD, from one source, so the structured data can never drift
 * from what a visitor actually reads. Google's guidance is explicit that FAQ
 * markup must match on-page content; rendering both from this file is how we
 * guarantee that instead of remembering to.
 *
 * Keep answers plain text. No markup, no links — the visible section renders
 * them as paragraphs and the JSON-LD escapes them.
 */

export interface FaqItem {
	question: string
	answer: string
}

export const servicesFaqs: FaqItem[] = [
	{
		question: 'Is Covenant Builders licensed in Florida?',
		answer:
			'Yes. Covenant Builders holds Florida Certified Building Contractor licence CBC1253676, active since December 8, 2005. You can verify it yourself on the Florida DBPR licence lookup before you ever call us.',
	},
	{
		question: 'What areas do you build in?',
		answer:
			'Vero Beach, Sebastian, Fort Pierce, Port St. Lucie, Fellsmere and the surrounding Treasure Coast. Office hours are Monday through Friday, 9:00 AM to 5:00 PM. If you are not sure whether your address is in range, ask us.',
	},
	{
		question: 'Do you pull your own permits?',
		answer:
			'Yes. We handle permit submittal and plan review ourselves and record the notice of commencement, rather than leaving that to you or handing it off to someone else.',
	},
	{
		question: 'How long does a project take?',
		answer:
			'Every service on this page publishes its full stage list with honest durations. On a new home, design, engineering and selections run 8 to 16 weeks, permitting 4 to 12 weeks, and structure and dry-in 8 to 14 weeks. A kitchen moves faster: consultation and feasibility 1 to 2 weeks, design and selections 3 to 8 weeks, cabinetry and finishes 4 to 10 weeks.',
	},
	{
		question: 'Do you build your own cabinets?',
		answer:
			'Yes. Cabinetry is built in our own shop rather than ordered from a catalogue, which is why our shop capacity, not a supplier queue, sets the kitchen schedule.',
	},
	{
		question: 'Do you handle storm damage and insurance restoration?',
		answer:
			'Yes. Our storm restoration process starts with inspection and documentation, then contract and claim coordination, an adjuster meeting to agree the scope, permitting and mobilisation, reconstruction, and closeout.',
	},
	{
		question: 'What do I get before I sign anything?',
		answer:
			'A written scope before work starts, and the step-by-step process for your service with honest durations, so you can read what happens and when before you commit to anything.',
	},
	{
		question: 'Do you speak Spanish?',
		answer:
			'Yes. Covenant Builders is a bilingual company. Hablamos español.',
	},
]

export const homeownerProgramsFaqs: FaqItem[] = [
	{
		question: 'How much money can I get from My Safe Florida Home?',
		answer:
			'Up to $10,000 toward approved wind-hardening upgrades, after a free state wind-mitigation inspection. Most property owners get a 2-to-1 match, meaning the state pays $2 for every $1 you spend, and low-income owners can qualify with no match required. The 2026 state budget put roughly $378 million back into the program and the application portal is open for the 2026-27 year.',
	},
	{
		question: 'Can a condo association get grant money for wind hardening?',
		answer:
			'Yes, through the My Safe Florida Condo pilot, which covers buildings three habitable stories and up. The association applies, not individual unit owners, and grants fund common elements such as roofs and openings. The pilot continues with about $27 million in fresh 2026 funding.',
	},
	{
		question: 'Do you charge to help me find programs?',
		answer:
			'No. Applying is free and we never charge for pointing the way. If you would rather not do the homework yourself, the eligibility check on this page takes about 60 seconds and we will tell you which programs likely fit your property.',
	},
	{
		question: 'My insurance claim was denied or underpaid. What can I do?',
		answer:
			'Florida runs a free residential property mediation program through the Department of Financial Services. The insurance company pays the entire cost, a neutral mediator is usually assigned within about three weeks, and if you reach a settlement you still have three business days to change your mind. Call the DFS consumer helpline at 1-877-693-5236.',
	},
	{
		question: 'Is Elevate Florida still taking applications?',
		answer:
			'No. Elevate Florida has been closed to new applications since April 2025, with existing awards delayed in federal review. If you already applied, check your status at 877-353-8835. If you did not, My Safe Florida Home is the live hardening option.',
	},
	{
		question: 'Do I have to hire Covenant Builders to use these programs?',
		answer:
			'No. When a grant or program funds hardening or repairs, you still choose your own licensed contractor. We provide the quotes, wind-mitigation documentation and licensed work that programs like My Safe Florida Home require, but you apply directly and the choice of builder stays yours.',
	},
	{
		question: 'Which counties does this guide cover?',
		answer:
			'Indian River, St. Lucie and Martin on the Treasure Coast, Brevard on the Space Coast, and Orange, Osceola, Seminole and Lake in the Orlando area, plus every statewide program.',
	},
	{
		question: 'How current is this information?',
		answer:
			'Program details, funding and deadlines change with each legislative session. Statuses on this page were verified in August 2026. Always confirm current terms on the official program sites linked above. Covenant Builders is not affiliated with these programs; applications are made directly by the property owner or association.',
	},
]
