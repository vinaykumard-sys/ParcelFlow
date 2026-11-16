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
        background: '#FAF7F2',
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#E8DFD1',
        },
        navy: {
          DEFAULT: '#0F172A',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        surface: {
          50: '#FAF7F2',
          100: '#FFFFFF',
          200: '#F4EFE6',
          card: '#FFFFFF',
        },
        brand: {
          primary: '#2563EB',
          secondary: '#3B82F6',
          orange: '#F97316',
          yellow: '#FBBF24',
          mint: '#10B981',
          indigo: '#4F46E5',
          emerald: '#10B981',
          cyan: '#06B6D4',
          accent: '#60A5FA',
        },
        slate: {
          border: '#0F172A',
          glow: 'rgba(37, 99, 235, 0.15)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'cartoon-sm': '2px 2px 0px #0F172A',
        'cartoon': '4px 4px 0px #0F172A',
        'cartoon-lg': '6px 6px 0px #0F172A',
        'cartoon-xl': '8px 8px 0px #0F172A',
        'cartoon-blue': '4px 4px 0px #2563EB',
        'cartoon-orange': '4px 4px 0px #EA580C',
        'neon': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'emerald-neon': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
