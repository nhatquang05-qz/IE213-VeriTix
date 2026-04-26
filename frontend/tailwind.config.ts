import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-night-900': '#0a1628',
        'brand-night-800': '#1a2742',
        'brand-cyan-500': '#00d4ff',
        'brand-blue-600': '#0066ff',
        'ed-bg-1': '#04070f',
        'ed-bg-2': '#091127',
        'ed-bg-3': '#0d1a33',
        'ed-card-border': 'rgba(125, 211, 252, 0.18)',
        'ed-text-main': '#f8fbff',
        'ed-text-subtle': '#c2d2e6',
        'ed-text-soft': '#8aa3bf',
        'ed-accent': '#34d3ff',
        'ed-accent-2': '#2f7bff',
        'ed-ok': '#22c55e',
        'ed-warn': '#f59e0b',
        'ed-danger': '#f43f5e',
      },
      fontFamily: {
        brand: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        space: ['Space Grotesk', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        'ed-panel': '28px',
        'ed-card': '22px',
      },
      boxShadow: {
        'ed-panel': '0 26px 80px rgba(1, 8, 24, 0.58)',
        'ed-card': '0 24px 70px rgba(1, 8, 24, 0.45)',
        'ed-btn': '0 18px 34px rgba(37, 99, 235, 0.42)',
        'ed-btn-hover': '0 24px 40px rgba(37, 99, 235, 0.5)',
        'ed-progress': '0 0 20px rgba(45, 212, 255, 0.4)',
      },
      keyframes: {
        'body-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'nav-gradient-shift': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        'event-detail-float-in': {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'body-glow': 'body-glow 30s ease-in-out infinite',
        'nav-gradient-shift': 'nav-gradient-shift 6s ease-in-out infinite',
        'ed-float-in': 'event-detail-float-in 520ms ease-out',
      },
    },
  },
} satisfies Config;
