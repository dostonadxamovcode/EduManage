/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf6f0',
          100: '#fae8d8',
          200: '#f5ccaa',
          300: '#eeaa78',
          400: '#e68548',
          500: '#c8623a',
          600: '#a84e2e',
          700: '#8a3d25',
          800: '#6e2f1d',
          900: '#4e2010',
        },
        sidebar: '#f5f0eb',
        warm: '#fdf8f4',
      },
      boxShadow: {
        card: '0 1px 8px rgba(0,0,0,0.06)',
        'card-md': '0 4px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
