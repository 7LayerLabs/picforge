/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brutal-yellow': '#FFC700',
        'brutal-pink': '#FF1B8D',
        'brutal-cyan': '#00CED1',
        'brutal-black': '#000000',
        'brutal-white': '#FFFFFF',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'tilt': 'tilt 0.3s ease-out',
      },
      boxShadow: {
        'brutal': '6px 6px 0 0 #000000',
        'brutal-lg': '8px 8px 0 0 #000000',
        'brutal-hover': '4px 4px 0 0 #000000',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '-1': '-1deg',
        '-2': '-2deg',
        '-3': '-3deg',
      },
    },
  },
  plugins: [],
}