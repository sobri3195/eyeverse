/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#22d3ee',
          600: '#0891b2'
        }
      },
      boxShadow: {
        glass: '0 8px 32px rgba(14, 165, 233, 0.12)'
      }
    }
  },
  plugins: []
};
