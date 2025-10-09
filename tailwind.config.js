/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'coral': {
          500: '#E76F51',
          600: '#d35842',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(42, 157, 143, 0.3)',
        'glow-lg': '0 0 50px rgba(42, 157, 143, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}