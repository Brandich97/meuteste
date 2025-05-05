/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neo-black': '#0A0A0B',
        'neo-gray': '#1A1A1C',
        'neo-white': '#FAFAFA',
        'neo-blue': {
          100: '#E6F4FF',
          200: '#BAE3FF',
          300: '#7CC4FA',
          400: '#47A3F3',
          500: '#2186EB',
          600: '#0967D2',
          700: '#0552B5',
          800: '#03449E',
          900: '#01337D',
        },
        'neo-purple': {
          100: '#F4E6FF',
          200: '#E2BAFF',
          300: '#C77DFA',
          400: '#AB47F3',
          500: '#9021EB',
          600: '#7209D2',
          700: '#5505B5',
          800: '#40039E',
          900: '#2D017D',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neo': '0 0 20px rgba(33, 134, 235, 0.15)',
        'neo-lg': '0 0 30px rgba(33, 134, 235, 0.2)',
        'neo-inner': 'inset 0 0 20px rgba(33, 134, 235, 0.15)',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
};