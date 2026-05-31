import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep ocean palette
        ocean: {
          50:  '#e6f7ff',
          100: '#b3e6ff',
          200: '#80d4ff',
          300: '#4dc3ff',
          400: '#1ab1ff',
          500: '#0099e6',
          600: '#0077b3',
          700: '#005580',
          800: '#00334d',
          900: '#001a2e',
          950: '#000d17',
        },
        // Accent — bioluminescent cyan
        biolum: {
          50:  '#e0fffe',
          100: '#b3fffc',
          200: '#80fff9',
          300: '#4dfff7',
          400: '#1afff4',
          500: '#00e6db',
          600: '#00b3aa',
          700: '#008079',
          800: '#004d48',
          900: '#001a18',
        },
        // Alert / pollution red
        pollution: {
          50:  '#fff0f0',
          100: '#ffd6d6',
          200: '#ffadad',
          300: '#ff8585',
          400: '#ff5c5c',
          500: '#ff3333',
          600: '#cc2929',
          700: '#991f1f',
          800: '#661414',
          900: '#330a0a',
        },
        // Health green
        marine: {
          50:  '#e6fff0',
          100: '#b3ffd6',
          200: '#80ffbd',
          300: '#4dffa3',
          400: '#1aff8a',
          500: '#00e670',
          600: '#00b357',
          700: '#00803e',
          800: '#004d25',
          900: '#001a0d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 230, 219, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 153, 230, 0.3)',
        'glow-red': '0 0 20px rgba(255, 51, 51, 0.3)',
        'glow-green': '0 0 20px rgba(0, 230, 112, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 230, 219, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 230, 219, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
