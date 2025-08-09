/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F7F7F7',    // 주조색
        'charcoal': '#333333',     // 보조색
        'accent': '#C4A484',       // 강조색
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      lineHeight: {
        'extra-loose': '1.8',
      }
    },
  },
  plugins: [],
};
