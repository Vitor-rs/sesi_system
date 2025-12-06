/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sesi: {
          dark: "#003366",
          blue: "#0066cc",
          light: "#4d94ff",
        },
      },
    },
  },
  plugins: [],
};
