/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#03020a',
        surface: '#07051a',
        elevated: '#0d0a2e',
        cyan: {
          DEFAULT: '#00f5ff',
          glow: '#00f5ff40',
        },
        violet: {
          DEFAULT: '#7b2fff',
          glow: '#7b2fff40',
        },
        pink: {
          DEFAULT: '#ff2fa0',
          glow: '#ff2fa040',
        },
        green: {
          DEFAULT: '#00ff88',
          glow: '#00ff8840',
        },
        gold: {
          DEFAULT: '#ffcc00',
          glow: '#ffcc0040',
        },
        'text-primary': '#e8e4ff',
        'text-secondary': '#9b94c4',
        'text-muted': '#5a527a',
        border: 'rgba(123,47,255,0.2)',
        glass: 'rgba(255,255,255,0.03)',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00f5ff20, 0 0 10px #00f5ff10' },
          '100%': { boxShadow: '0 0 20px #00f5ff40, 0 0 40px #00f5ff20' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
