/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors : {
        'nav-bg' : '#19202E',
        'content-bg' : '#1F2330',
        'input-bg' : '#2E3241',
        'login-btn' : '#1A456B',
        'login-text': 'rgba(255, 255, 255, 0.46)',
      },
    }
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark']
  }
}
