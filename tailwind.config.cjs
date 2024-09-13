import defaultTheme from 'tailwindcss/defaultTheme';
import typographyPlugin from '@tailwindcss/typography';

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
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
      // TODO: customize the font stack to design
      fontSize: {
        'text-xs': [
          '0.75rem', // 12px
          {
            lineHeight: '1rem', // 16px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-sm': [
          '1.5rem', // 14px
          {
            lineHeight: '1.25rem', // 20px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-base': [
          '1rem', // 16px
          {
            lineHeight: '1.5rem', // 24px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-lg': [
          '1.125rem', // 18px
          {
            lineHeight: '1.75rem', // 28px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-xl': [
          '1.25rem', // 20px
          {
            lineHeight: '1.75rem', // 28px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-2xl': [
          '1.5rem', // 24px
          {
            lineHeight: '2rem', // 32px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-3xl': [
          '1.875rem', // 30px
          {
            lineHeight: '2.25rem', // 36px
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
        'text-4xl': [
          '2.25rem', // 36px
          {
            lineHeight: '2.5rem', // 40px
            letterSpacing: '-0.01em',
            fontWeight: '500',
          },
        ],
        'text-5xl': [
          '3rem', // 48px
          {
            lineHeight: '1',
            letterSpacing: '-0.01em',
            fontWeight: '400',
          },
        ],
      },
      fontFamily: {
        sans: ['var(--font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: defaultTheme.fontFamily.serif,
        heading: ['var(--font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono, ui-sans-serif)', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [typographyPlugin],
  darkMode: 'class',
};
