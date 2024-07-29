/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-teal': '#00695c',
        
      },
      screens: {
        'mdl': '370px', 
      },
    },
  },
  plugins: [],
  variants: {},
}