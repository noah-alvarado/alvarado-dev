/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  safelist: [
    // Grid span classes for PhotoGrid component
    'col-span-1',
    'col-span-2',
    'row-span-1',
    'row-span-2',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
