/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}","./src/**/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      screens: {
        'landscape-sm': { 'raw': '(max-width: 900px) and (orientation: landscape)' },
      },
    },
  },
  plugins: [],
}

