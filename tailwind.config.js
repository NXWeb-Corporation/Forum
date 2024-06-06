/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-bg': '#343A40',
        'title-blue': '#008cff',
        'darker-blue': '#006cc5',
        'darkerer-blue': '#0464b3'
      },
      fontFamily: {
        poppins: "Poppins",
        rubik: "Rubik",
      },
      spacing:{
        textw: "864px",
        buttonr: "550px",
        half: "50vh"
      },
      size:{
        idk: "500px"
      }
    },
  },
  plugins: [],
}

