/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1F3A',
          light: '#142a4d',
          dark: '#061226',
        },
        accent: {
          DEFAULT: '#FF6B00',
          light: '#ff8c38',
          dark: '#cc5500',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
};
