/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      background: "#111",
      day: "#cbc3c3",
      link: "#cbc3c3",
      linkPanel: "#3c3c3c",
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
    },
    fontFamily: {
      sans: ["Noto Sans TC", "sans-serif"]
    },
    extend: {

    },
  },
  plugins: [],
}

