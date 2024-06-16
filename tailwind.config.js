/** @type {import('tailwindcss').Config} */
/** @type {DefaultColors} */
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: colors.teal,
        secondary: colors.rose,
        border_color: '#dee2e6',
        dark_green: '#181826',
      },
      fontFamily: {
        monteserat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
