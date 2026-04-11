import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      fontFamily: {
        sans: ['"Cabinet Grotesk"', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: { DEFAULT: 'oklch(var(--primary) / <alpha-value>)', foreground: 'oklch(var(--primary-foreground))' },
        secondary: { DEFAULT: 'oklch(var(--secondary) / <alpha-value>)', foreground: 'oklch(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'oklch(var(--destructive) / <alpha-value>)', foreground: 'oklch(var(--destructive-foreground))' },
        muted: { DEFAULT: 'oklch(var(--muted) / <alpha-value>)', foreground: 'oklch(var(--muted-foreground) / <alpha-value>)' },
        accent: { DEFAULT: 'oklch(var(--accent) / <alpha-value>)', foreground: 'oklch(var(--accent-foreground))' },
        popover: { DEFAULT: 'oklch(var(--popover))', foreground: 'oklch(var(--popover-foreground))' },
        card: { DEFAULT: 'oklch(var(--card))', foreground: 'oklch(var(--card-foreground))' },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))',
        },
        navy: {
          50: 'oklch(0.96 0.015 250)', 100: 'oklch(0.92 0.025 250)', 200: 'oklch(0.82 0.04 250)',
          300: 'oklch(0.68 0.07 250)', 400: 'oklch(0.55 0.1 250)', 500: 'oklch(0.42 0.12 255)',
          600: 'oklch(0.32 0.1 255)', 700: 'oklch(0.24 0.08 255)', 800: 'oklch(0.18 0.06 255)', 900: 'oklch(0.13 0.05 255)',
        },
        gold: {
          50: 'oklch(0.97 0.04 80)', 100: 'oklch(0.93 0.08 75)', 200: 'oklch(0.88 0.12 70)',
          300: 'oklch(0.82 0.16 65)', 400: 'oklch(0.76 0.18 60)', 500: 'oklch(0.72 0.17 55)',
          600: 'oklch(0.65 0.16 50)', 700: 'oklch(0.55 0.15 48)', 800: 'oklch(0.44 0.12 45)', 900: 'oklch(0.32 0.09 42)',
        },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      boxShadow: {
        xs: '0 1px 2px 0 oklch(0.18 0.06 255 / 0.06)',
        sm: '0 2px 6px oklch(0.18 0.06 255 / 0.08)',
        md: '0 4px 16px oklch(0.18 0.06 255 / 0.1)',
        lg: '0 8px 32px oklch(0.18 0.06 255 / 0.12)',
        gold: '0 4px 20px oklch(0.72 0.17 55 / 0.35)',
        navy: '0 4px 20px oklch(0.18 0.06 255 / 0.4)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer: { '0%': { backgroundPosition: '200% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};