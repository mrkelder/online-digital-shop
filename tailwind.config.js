module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "#fff",
      grey: {
        50: "#FAFAFA",
        75: "#F5F5F5",
        100: "#D6D6D6",
        200: "#afafaf",
        300: "#666",
        400: "#4a4d4e",
        500: "#3C3F40",
        600: "#333",
        650: "#303233",
        transparent: "#333333a6"
      },
      red: "#e60000",
      transparent: "#0000"
    },
    extend: {
      fontFamily: {
        regular: ["Vodafone Rg", "sans"],
        light: ["Vodafone Lt", "sans"]
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(0px)" }
        },
        disappear: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        }
      },
      animation: {
        slide: "slide .4s ease-in-out",
        disappear: "disappear 1s ease-in-out"
      }
    }
  },
  variants: {
    extend: {
      display: ["group-hover", "group-focus"],
      rotate: ["group-hover", "group-focus"]
    }
  },
  plugins: []
};
