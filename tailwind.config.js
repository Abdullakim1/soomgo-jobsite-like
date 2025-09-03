/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563eb', // blue-600
        },
        slate: {
          50: '#f8fafc',
          700: '#334155',
          900: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
