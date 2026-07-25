import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				navy: {
					DEFAULT: '#12182B',
					deep: '#0C1120',
					soft: '#1C2438',
				},
				sand: {
					DEFAULT: '#C4A574',
					light: '#D4BC96',
					dark: '#A88A58',
				},
				stone: {
					DEFAULT: '#F3F0EA',
					warm: '#E8E2D6',
					muted: '#6B655C',
				},
				ink: '#1A1A1A',
			},
			fontFamily: {
				display: ['var(--font-display)', 'Georgia', 'serif'],
				sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
			},
			backgroundImage: {
				'hero-veil':
					'linear-gradient(115deg, rgba(12,17,32,0.88) 0%, rgba(18,24,43,0.72) 45%, rgba(18,24,43,0.55) 100%)',
				'section-fade':
					'linear-gradient(180deg, #F3F0EA 0%, #E8E2D6 100%)',
				grain:
					"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
			},
			keyframes: {
				'fade-rise': {
					'0%': { opacity: '0', transform: 'translateY(18px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
			animation: {
				'fade-rise': 'fade-rise 0.9s ease-out both',
				'fade-rise-delay': 'fade-rise 0.9s ease-out 0.15s both',
				'fade-rise-delay-2': 'fade-rise 0.9s ease-out 0.3s both',
				'fade-in': 'fade-in 1.1s ease-out both',
			},
		},
	},
	plugins: [],
}

export default config
