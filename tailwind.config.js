/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          red: '#E73F1E',
          orange: '#FB6C00',
          yellow: '#F9B637',
          cream: '#FFDD9C',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#FFDD9C',
          400: '#F9B637',
          500: '#FB6C00',
          600: '#E73F1E',
          700: '#c22d10',
          800: '#9a240d',
          900: '#7c200e',
        }
      }
    },
  },
  plugins: [],
}

