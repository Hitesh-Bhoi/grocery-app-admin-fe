/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/cards/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/charts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/tables/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/dashboard/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
