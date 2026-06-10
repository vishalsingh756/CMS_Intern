/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#07070D',
        surface: '#0F0F1C',
        panel:   '#141425',
        indigo:  '#4F46E5',
        violet:  '#7C3AED',
        rose:    '#E11D48',
        gold:    '#F59E0B',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px'
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Playfair Display', 'Outfit', 'serif']
      },
      letterSpacing: {
        tighter: '-0.03em',
        display: '-0.04em',
      },
      boxShadow: {
        glass: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5)',
        glow:  '0 0 40px rgba(79,70,229,0.25)',
        card:  '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
