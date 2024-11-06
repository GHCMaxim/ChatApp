/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ['Poppins', "sans-serif"],
      serief: ['ui-sans-serif'],
      sans: ['Helvetica', 'Arial', 'sans-serif'],
      Rubik: ['Rubik']
    },
    extend: {
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "480px": "480px",
        "400px": "400px"
      },
      colors : {
        'nav-bg' : '#19202E',
        'content-bg' : '#1F2330',
        'input-bg' : '#2E3241',
        'login-btn' : '#1A456B',
        'login-text': 'rgba(255, 255, 255, 0.46)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    prefix: "daisy-", // Sử dụng prefix cho DaisyUI
    themes: ['light', 'dark'],
  },
};
