import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const ARCHIVE_THEME = {
  light: {
    bg: "#fafaf8",
    text: "#2a2a2a",
    accent: "#b8935c",
    border: "#e5e5e0",
    hover: "#f2f2f0",
  },
  dark: {
    bg: "#1a1a18",
    text: "#e8e8e6",
    accent: "#d4a574",
    border: "#2d2d2a",
    hover: "#252523",
  },
} as const;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Noto Serif TC", "serif"],
      },
      colors: {
        archive: {
          bg: "var(--bg)",
          text: "var(--text)",
          accent: "var(--accent)",
          border: "var(--border)",
          hover: "var(--hover)",
        },
      },
      transitionTimingFunction: {
        "archive-ease": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": {
          "--bg": ARCHIVE_THEME.light.bg,
          "--text": ARCHIVE_THEME.light.text,
          "--accent": ARCHIVE_THEME.light.accent,
          "--border": ARCHIVE_THEME.light.border,
          "--hover": ARCHIVE_THEME.light.hover,
        },
        ".dark": {
          "--bg": ARCHIVE_THEME.dark.bg,
          "--text": ARCHIVE_THEME.dark.text,
          "--accent": ARCHIVE_THEME.dark.accent,
          "--border": ARCHIVE_THEME.dark.border,
          "--hover": ARCHIVE_THEME.dark.hover,
        },
      });
    }),
  ],
} satisfies Config;
