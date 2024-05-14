/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      padding: {
        sm: "2rem",
        md: "10rem",
      }
    }
  },
  plugins: [],
}