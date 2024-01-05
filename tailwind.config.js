const colors = require('@mui/material/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  important: "#__next",
  theme: {
    extend: {
      colors: { ...colors }
    },
  },
  plugins: [],
};
