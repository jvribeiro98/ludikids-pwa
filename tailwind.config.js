/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ludikids: {
          teal: '#78C3C7',
          yellow: '#EFD179',
          coral: '#E99A8C',
          blue: '#E3F8FA',
          cream: '#FFF6E5',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

