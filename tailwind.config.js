module.exports = {
  content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
  plugins: [require('@tailwindcss/forms')],
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  theme: {
    extend: {
      colors: {
        'ac-black-orange': '#64625d',
        'ac-orange': '#EFA72B'
      }
    }
  }
};
