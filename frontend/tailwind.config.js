/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        foreground: '#171717',
        primary: '#CCFF00', // Neon Lime
        secondary: '#000000', // Solid Black
        'primary-foreground': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
      }
    },
  },
  plugins: [],
}
