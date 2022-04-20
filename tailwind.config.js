module.exports = {
  mode: 'jit',
  content: [
    './public/**/*.html',
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  dark: false,
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
