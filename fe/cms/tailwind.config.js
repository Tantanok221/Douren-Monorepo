/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      background: "#111",
      black: "#000000",
      day: "#cbc3c3",
      link: "#cbc3c3",
      linkPanel: "#3c3c3c",
      transparent: 'transparent',
      numberTag: "#838181",
      numberTagBackground: "#3c3c3c",
      panel: "#1f1f21",
      tagBackground: "#464646",
      tagText: "#aaaaaa",
      white: "#ffffff",
      onHover: "#4d4d4d",
      sidebarBg: "#1d1d1d",
      sidebarActive: "#292929",
      stroke: "#3c3c3c",
      formBorder: "#494949",
      highlightFormBorder: "#a3a0a0",
    },
    fontFamily: {
      sans: ["Noto Sans TC", "sans-serif"]
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      colors: {}
    }
  },
  plugins: [require("tailwindcss-animate")]
};

