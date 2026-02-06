
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        archive: {
          bg: 'var(--bg)',
          text: 'var(--text)',
          accent: 'var(--accent)',
          border: 'var(--border)',
          hover: 'var(--hover)',
        }
      },
      transitionTimingFunction: {
        'archive-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    },
  },
  plugins: [],
}
