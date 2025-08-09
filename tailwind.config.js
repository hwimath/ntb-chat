/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // 이 부분이 수정되었습니다.
  ],
  theme: {
    extend: {
      colors: {
        'off-white': '#F7F7F7',
        'charcoal': '#333333',
        'accent': '#C4A484',
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
