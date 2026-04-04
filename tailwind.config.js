/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sadhna-red': '#3d0000',
        'sadhna-black': '#000000',
        'sadhna-navy': '#060650',
        'energy-cyan': '#00D9FF',
        'energy-gold': '#FFD700',
        'energy-pink': '#FF1493',
        'energy-lime': '#39FF14',
        'energy-coral': '#FF6B6B',
        background: '#0a0a0f',
        white: '#ffffff',
        accent: {
          light: '#FF6B6B',
          DEFAULT: '#FF1493',
          dark: '#3d0000',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          alt: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sadhna-gradient': 'linear-gradient(135deg, #3d0000 0%, #060650 50%, #000000 100%)',
        'energy-gradient': 'linear-gradient(135deg, #FF1493 0%, #FF6B6B 25%, #FFD700 50%, #00D9FF 75%, #39FF14 100%)',
      }
    },
  },
  plugins: [],
}
