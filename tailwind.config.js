/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#F6F3EC',
          50: '#FCFAF7',
          100: '#F6F3EC',
          200: '#EFEBE1',
          300: '#E4DDD0',
          400: '#D5CCBC',
        },
        ink: {
          DEFAULT: '#24251F',
          muted: '#63655B',
          soft: '#85877A',
          border: '#DED9CE',
        },
        primary: {
          DEFAULT: '#435640',
          hover: '#364634',
          light: '#EBF0EA',
          soft: '#536B4F',
        },
        accent: {
          DEFAULT: '#BD8856',
          hover: '#A67444',
          light: '#F8F1EA',
          subtle: '#E8D2BD',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        editorial: '.08em',
      },
    },
  },
  plugins: [],
}
