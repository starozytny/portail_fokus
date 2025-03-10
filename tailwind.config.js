/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.{js,jsx,ts,tsx}",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      screens: {
        'qhd': '1864px',
        '2qhd': '2500px',
      },
      spacing: {
        '6.5': '1.625rem',
        '8.5': '2.25rem'
      },
      colors: {
        'color0': '#60799C',
        'color1': '#ffb839',
        'color2': '#1b222a',
        'color3': '#455872',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

