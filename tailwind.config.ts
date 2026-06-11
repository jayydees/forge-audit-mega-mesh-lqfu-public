import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			gray: {
  				50: 'rgb(var(--gray-50) / <alpha-value>)',
  				100: 'rgb(var(--gray-100) / <alpha-value>)',
  				200: 'rgb(var(--gray-200) / <alpha-value>)',
  				300: 'rgb(var(--gray-300) / <alpha-value>)',
  				400: 'rgb(var(--gray-400) / <alpha-value>)',
  				500: 'rgb(var(--gray-500) / <alpha-value>)',
  				600: 'rgb(var(--gray-600) / <alpha-value>)',
  				700: 'rgb(var(--gray-700) / <alpha-value>)',
  				800: 'rgb(var(--gray-800) / <alpha-value>)',
  				900: 'rgb(var(--gray-900) / <alpha-value>)',
  				950: 'rgb(var(--gray-950) / <alpha-value>)',
  			},
  			red: {
  				950: 'rgb(var(--red-950) / <alpha-value>)',
  				900: 'rgb(var(--red-900) / <alpha-value>)',
  			},
  			orange: {
  				950: 'rgb(var(--orange-950) / <alpha-value>)',
  				900: 'rgb(var(--orange-900) / <alpha-value>)',
  			},
  			yellow: {
  				950: 'rgb(var(--yellow-950) / <alpha-value>)',
  				900: 'rgb(var(--yellow-900) / <alpha-value>)',
  			},
  			emerald: {
  				950: 'rgb(var(--emerald-950) / <alpha-value>)',
  				900: 'rgb(var(--emerald-900) / <alpha-value>)',
  			},
  			blue: {
  				950: 'rgb(var(--blue-950) / <alpha-value>)',
  				900: 'rgb(var(--blue-900) / <alpha-value>)',
  			},
  			purple: {
  				950: 'rgb(var(--purple-950) / <alpha-value>)',
  				900: 'rgb(var(--purple-900) / <alpha-value>)',
  			},
  			cyan: {
  				950: 'rgb(var(--cyan-950) / <alpha-value>)',
  				900: 'rgb(var(--cyan-900) / <alpha-value>)',
  			},
  			pink: {
  				950: 'rgb(var(--pink-950) / <alpha-value>)',
  				900: 'rgb(var(--pink-900) / <alpha-value>)',
  			},
  			violet: {
  				950: 'rgb(var(--violet-950) / <alpha-value>)',
  				900: 'rgb(var(--violet-900) / <alpha-value>)',
  			},
  			amber: {
  				950: 'rgb(var(--amber-950) / <alpha-value>)',
  				900: 'rgb(var(--amber-900) / <alpha-value>)',
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
