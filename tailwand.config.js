/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#e8e8e8',
          100: '#d1d1d1',
          200: '#a3a3a3',
          300: '#757575',
          400: '#474747',
          500: '#1a1a1a',
          600: '#151515',
          700: '#101010',
          800: '#0a0a0a',
          900: '#050505',
        },
        primary: {
          500: '#0066ff',
          600: '#0052cc',
        }
      }
    }
  },
  plugins: [],
}