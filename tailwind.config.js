module.exports = {
  darkMode: 'class',
  content: [
    'public/**/*.{html,js}',
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        turquoise: {
          400: '#30d5c8',
        },
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
