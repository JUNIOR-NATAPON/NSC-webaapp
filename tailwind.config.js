/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2A5FE0',
          dark: '#1E46B8',
          light: '#EAF0FE'
        },
        clean: {
          DEFAULT: '#22B26A',
          bg: '#E4F7EC'
        },
        warn: {
          DEFAULT: '#E0A824',
          bg: '#FDF2DA'
        },
        danger: {
          DEFAULT: '#E5484D',
          bg: '#FCE6E7'
        },
        surface: {
          DEFAULT: '#F6F8FC',
          dark: '#0F1420'
        },
        card: {
          dark: '#1B2236'
        },
        ink: '#12172B',
        muted: {
          DEFAULT: '#6B7280',
          dark: '#9AA7BD'
        }
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        card: '0 2px 10px rgba(18, 23, 43, 0.06)'
      }
    }
  },
  plugins: []
}
