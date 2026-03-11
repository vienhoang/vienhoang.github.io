/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cube-sage': '#A7F3D0',
        'cube-rose': '#FBCFE8',
        'cube-blue': '#BFDBFE',
        'cube-lavender': '#E9D5FF',
        'cube-peach': '#FED7AA',
        'cube-mint': '#D1FAE5',
        'warm-gray': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        }
      }
    }
  },
  plugins: [],
}
