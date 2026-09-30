/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
        body: ["Source Sans 3", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#0A0E13",
        surface: "#141B22",
        surface2: "#1B242D",
        line: "#26313B",
        lime: "#C6FF4D",
        lime2: "#8FE04A",
        gold: "#E4C05C",
        silver: "#B9C2CC",
        bronze: "#D08A55",
        muted: "#8B95A1",
        danger: "#FF6B81",
        ink: "#F5F7FA",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
