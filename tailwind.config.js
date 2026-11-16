/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: {
          50: '#151D2E',
          100: '#1E293B',
          200: '#0F172A',
          card: 'rgba(15, 23, 42, 0.75)',
        },
        brand: {
          primary: '#3B82F6',
          secondary: '#2563EB',
          indigo: '#4F46E5',
          emerald: '#10B981',
          cyan: '#06B6D4',
          accent: '#60A5FA',
        },
        slate: {
          border: '#1E293B',
          glow: 'rgba(59, 130, 246, 0.15)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.8' },
        }
      },
      boxShadow: {
        'neon': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'emerald-neon': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
