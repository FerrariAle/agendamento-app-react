/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f0f7f4',
          '100': '#ddeee6',
          '200': '#bfdcd0',
          '300': '#a1c9ba',
          '400': '#68a990',
          '500': '#3d886d',
          '600': '#2a6f55',
          '700': '#1e5845',
          '800': '#184537',
          '900': '#123524',
          '950': '#0a1d13',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}