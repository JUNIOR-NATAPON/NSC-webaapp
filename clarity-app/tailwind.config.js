/** @type {import('tailwindcss').Config} */
export default {
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
        surface: '#F6F8FC',
        ink: '#12172B',
        muted: '#6B7280'
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
