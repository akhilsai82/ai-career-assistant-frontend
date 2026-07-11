/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0E14',
          900: '#111520',
          800: '#1A2030',
          700: '#252C3F',
          600: '#3A4358',
        },
        amber: {
          400: '#F0A94E',
          500: '#E1922E',
          600: '#C77A1C',
        },
        mist: {
          400: '#8891A5',
          300: '#AEB5C4',
          200: '#D3D7E0',
          100: '#EEF0F4',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
