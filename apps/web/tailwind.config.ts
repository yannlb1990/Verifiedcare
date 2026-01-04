import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Verified Care Color Palette
      colors: {
        // Primary - Trust & Care (Teal/Green)
        primary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#3D7A5A', // Light
          600: '#2D5A4A', // Default
          700: '#1B4D3E', // Dark
          800: '#1B5E20',
          900: '#0D3320',
          DEFAULT: '#2D5A4A',
          foreground: '#FFFFFF',
        },
        // Secondary - Warmth & Action (Terracotta/Coral)
        secondary: {
          50: '#FFF3ED',
          100: '#FFE4D6',
          200: '#FFC9AD',
          300: '#F4A27B', // Light
          400: '#E07850', // Default
          500: '#C75B39', // Dark
          600: '#B54A2A',
          700: '#9A3A1F',
          800: '#7F2D18',
          900: '#662211',
          DEFAULT: '#E07850',
          foreground: '#FFFFFF',
        },
        // Neutral - Foundation
        background: '#F5F2ED', // Cream
        foreground: '#1A1A1A', // Charcoal
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#8A8A8A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        border: '#E0E0E0',
        input: '#E0E0E0',
        ring: '#2D5A4A',
        // Semantic Colors
        success: {
          DEFAULT: '#2E7D32',
          foreground: '#FFFFFF',
          light: '#E8F5E9',
        },
        error: {
          DEFAULT: '#D32F2F',
          foreground: '#FFFFFF',
          light: '#FFEBEE',
        },
        warning: {
          DEFAULT: '#F9A825',
          foreground: '#1A1A1A',
          light: '#FFF8E1',
        },
        info: {
          DEFAULT: '#1976D2',
          foreground: '#FFFFFF',
          light: '#E3F2FD',
        },
        // Status Colors
        status: {
          pending: '#FFF8E1',
          accepted: '#E3F2FD',
          'in-progress': '#E8F5E9',
          completed: '#E8F5E9',
          cancelled: '#F5F5F5',
          disputed: '#FFEBEE',
        },
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      // Spacing (4px base unit)
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      // Border Radius
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
        'full': '9999px',
      },
      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'card': '0 2px 8px -2px rgb(0 0 0 / 0.08)',
      },
      // Animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
      },
      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: '16px',
          sm: '24px',
          lg: '32px',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
};

export default config;
