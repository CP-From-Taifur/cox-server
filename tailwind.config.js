module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blueGray: {
          50: "#ebecee",
          100: "#d6d9dd",
          200: "#c2c6cc",
          300: "#adb3bb",
          400: "#99a0aa",
          500: "#858d99",
          600: "#707a88",
          700: "#5c6777",
          800: "#475466",
          900: "#334155",
        },
      },
      fontFamily: {
        sans: ["Nunito Sans"],
      },
    },
  },

  variants: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
};
