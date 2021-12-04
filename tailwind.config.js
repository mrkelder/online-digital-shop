module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "#fff",
      grey: {
        300: "#666",
        400: "#4a4d4e",
        500: "#3C3F40",
        600: "#333",
        650: "#303233"
      },
      red: "#e60000"
    },
    extend: {
      fontFamily: {
        regular: ["Vodafone Rg", "sans"],
        light: ["Vodafone Lt", "sans"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
