import type { Config } from 'tailwindcss';

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
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        // Body is the system font (brand guide, Type). Display is Bricolage Grotesque, self-hosted.
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: ['var(--font-display)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      colors: {
        // The Taproom palette (company/portfolio/whichcraft/brand-refresh-plan.md). Names are
        // fixed colours; the semantic tokens below switch with the light and dark scheme.
        stout: 'rgb(var(--stout) / <alpha-value>)',
        porter: 'rgb(var(--porter) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        'amber-ink': 'rgb(var(--amber-ink) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        head: 'rgb(var(--head) / <alpha-value>)',
        foam: 'rgb(var(--foam) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'stout-lit': 'rgb(var(--stout-lit) / <alpha-value>)',
        'stout-mute': 'rgb(var(--stout-mute) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        // The one action colour: Amber with Ink text, in both schemes.
        action: {
          DEFAULT: 'rgb(var(--amber) / <alpha-value>)',
          foreground: 'rgb(var(--ink) / <alpha-value>)',
        },
        // Accent text and links: Amber Ink on light, Gold on dark. Never plain Amber as light text.
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
