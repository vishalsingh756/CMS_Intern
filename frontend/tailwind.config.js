/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        accent:  '#6366f1',
        accent2: '#818cf8',
        surface: '#111118',
        border:  'rgba(255,255,255,0.07)',
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
