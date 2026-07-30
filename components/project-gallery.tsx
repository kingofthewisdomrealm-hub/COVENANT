'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import {
	portfolioProjects,
	type ProjectCategory,
} from '@/content/site'

const filters: Array<{ id: 'all' | ProjectCategory; label: string }> = [
	{ id: 'all', label: 'All' },
	{ id: 'residential', label: 'Residential' },
	{ id: 'commercial', label: 'Commercial' },
	{ id: 'remodel', label: 'Remodel' },
]

interface ProjectGalleryProps {
	limit?: number
	showFilters?: boolean
}

export function ProjectGallery({
	limit,
	showFilters = true,
}: ProjectGalleryProps) {
	const [activeFilter, setActiveFilter] = useState<'all' | ProjectCategory>(
		'all'
	)

	const projects = useMemo(() => {
		const filtered =
			activeFilter === 'all'
				? portfolioProjects
				: portfolioProjects.filter(
						(project) => project.category === activeFilter
					)
		return typeof limit === 'number' ? filtered.slice(0, limit) : filtered
	}, [activeFilter, limit])

	const handleFilterClick = (id: 'all' | ProjectCategory) => {
		setActiveFilter(id)
	}

	const handleFilterKeyDown = (
		event: React.KeyboardEvent<HTMLButtonElement>,
		id: 'all' | ProjectCategory
	) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			setActiveFilter(id)
		}
	}

	return (
		<div className="space-y-8">
			{showFilters ? (
				<div
					className="flex flex-wrap gap-3"
					role="tablist"
					aria-label="Portfolio filters"
				>
					{filters.map((filter) => {
						const isActive = activeFilter === filter.id
						return (
							<button
								key={filter.id}
								type="button"
								role="tab"
								aria-selected={isActive}
								tabIndex={0}
								onClick={() => handleFilterClick(filter.id)}
								onKeyDown={(event) =>
									handleFilterKeyDown(event, filter.id)
								}
								className={`border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.16em] transition ${
									isActive
										? 'border-navy bg-navy text-white'
										: 'border-navy/20 bg-transparent text-navy hover:border-navy'
								}`}
							>
								{filter.label}
							</button>
						)
					})}
				</div>
			) : null}

			{projects.length === 0 ? (
				<p className="body-copy">
					No projects in this category yet. Check back as we add more completed
					jobs from the Treasure Coast.
				</p>
			) : (
				<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<li key={project.id}>
							<article className="group overflow-hidden border border-navy/10 bg-white/70 transition duration-300 hover:-translate-y-1 hover:border-sand">
								<div className="relative aspect-[4/3] overflow-hidden bg-stone-warm">
									<Image
										src={project.image}
										alt={project.alt}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
									/>
								</div>
								<div className="space-y-3 p-5">
									<p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sand-dark">
										{project.category}
									</p>
									<h3 className="font-display text-2xl leading-snug text-navy">
										{project.title}
									</h3>
									<p className="font-sans text-sm text-stone-muted">
										{project.location}
									</p>
									<p className="font-sans text-sm leading-relaxed text-ink/80">
										{project.scope}
									</p>
									{project.story ? (
										<p className="font-sans text-sm leading-relaxed text-ink/70">
											{project.story}
										</p>
									) : null}
								</div>
							</article>
						</li>
					))}
				</ul>
			)}

			<p className="max-w-2xl font-sans text-sm leading-relaxed text-stone-muted">
				A look at recent planning, cabinetry, and build work from our Treasure
				Coast jobs. Fuller project stories—with scope and results—will be added
				as we photograph more completed homes and remodels.
			</p>
		</div>
	)
}
