import defaultTheme from 'tailwindcss/defaultTheme';
import typographyPlugin from '@tailwindcss/typography';
import tailwindScrollbar from 'tailwind-scrollbar';

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ring: 'hsl(var(--ring))',
        border: {
          DEFAULT: 'hsl(var(--border))',
          secondary: 'hsl(var(--border-secondary))',
        },
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          action: 'hsl(var(--primary-action))',
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          border: 'hsl(var(--input-border))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          border: 'hsl(var(--secondary-border))',
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          tertiary: 'hsl(var(--muted-tertiary))',
        },
        icon: {
          DEFAULT: 'hsl(var(--icon-default))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        scroll: {
          DEFAULT: 'hsl(var(--scroll))',
          track: 'hsl(var(--scroll-track))',
          hover: 'hsl(var(--scroll-hover))',
          active: 'hsl(var(--scroll-active))',
        },
        ['pill-error']: {
          DEFAULT: 'hsl(var(--pill-error))',
          foreground: 'hsl(var(--pill-error-foreground))',
        },
        ['pill-warning']: {
          DEFAULT: 'hsl(var(--pill-warning))',
          foreground: 'hsl(var(--pill-warning-foreground))',
        },
        custom: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
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
      fontFamily: {
        sans: ['var(--font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: defaultTheme.fontFamily.serif,
        heading: ['var(--font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono, ui-sans-serif)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [typographyPlugin, tailwindScrollbar({ preferredStrategy: 'pseudoelements' })],
  darkMode: 'class',
};
