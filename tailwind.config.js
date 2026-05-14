/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sora"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#3730A3',
        },
        surface: {
          DEFAULT: '#F9FAFB',
          card: 'rgba(255,255,255,0.72)',
          border: 'rgba(255,255,255,0.55)',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-lg': '0 24px 64px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        glow: '0 0 0 3px rgba(79,70,229,0.30), 0 20px 60px rgba(79,70,229,0.18)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
