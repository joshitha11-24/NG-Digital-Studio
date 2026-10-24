/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          gold: '#d4af37',
          dark: '#0b0b0e',
          card: '#121217',
          border: '#20202a'
        }
      }
    },
  },
  plugins: [],
}
