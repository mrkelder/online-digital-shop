module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "var(--white)",
      grey: {
        50: "var(--grey-50)",
        75: "var(--grey-75)",
        100: "var(--grey-100)",
        200: "var(--grey-200)",
        300: "var(--grey-300)",
        400: "var(--grey-400)",
        500: "var(--grey-500)",
        600: "var(--grey-600)",
        650: "var(--grey-650)",
        transparent: "var(--grey-transparent)"
      },
      red: "var(--red)",
      "red-focus": "var(--red-focus)",
      transparent: "var(--transparent)",
      success: "var(--success)"
    },
    extend: {
      width: {
        120: "418px",
        215: "1500px"
      },
      height: {
        86: "335px",
        130: "510px"
      },
      fontFamily: {
        regular: ["Vodafone Rg", "sans"],
        light: ["Vodafone Lt", "sans"]
      },
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(0px)" }
        },
        "slide-right": {
          "0%": { transform: "translateX(120%)" },
          "100%": { transform: "translateX(0px)" }
        },
        disappear: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        }
      },
      animation: {
        "slide-left": "slide-left .4s ease-in-out",
        "slide-right": "slide-right .4s ease-in-out",
        disappear: "disappear 1s ease-in-out"
      }
    }
  },
  variants: {
    extend: {
      display: ["group-hover", "group-focus"],
      rotate: ["group-hover", "group-focus"]
    }
  }
};
