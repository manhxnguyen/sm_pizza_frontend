/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pizza: {
          50: '#fef7ed',
          100: '#fdead5',
          200: '#f9d2aa',
          300: '#f4b274',
          400: '#ed883c',
          500: '#e76b1a',
          600: '#d85410',
          700: '#b34210',
          800: '#8f3514',
          900: '#732d13',
        }
      }
    },
  },
  plugins: [],
}
