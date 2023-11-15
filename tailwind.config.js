/** @type {import('tailwindcss').Config} */
/**
 * @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');
 */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        textCursive: ['Dancing Script', 'cursive']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        bgGreen: '#183C33',
        bgLight: '#F2EFE7',
        textLight: '#91CD65',
        textPink: '#FAB79B',
        buttonBlue: '#1565C0',
        bgGray: '#EBE7DA',
        bgDark: '#202324'
      }
    },
  },
  plugins: [],
}
