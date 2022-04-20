module.exports = {
  mode: 'jit',
  content: [
    './public/**/*.html',
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  dark: false,
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
