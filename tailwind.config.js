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
  // important: "#__next",
  theme: {
    extend: {
      // https://mui.com/material-ui/customization/color/
      colors: { ...colors },
      // https://mui.com/material-ui/customization/breakpoints/
      screens: {
        'xs': '0px',
        'sm': '600px',
        'md': '900px',
        'lg': '1200px',
        'xl': '1536px',
      },
    },
  },
  plugins: [],
};
