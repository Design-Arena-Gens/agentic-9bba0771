import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d7ecff",
          200: "#b3dcff",
          300: "#7cc0ff",
          400: "#389bff",
          500: "#0a78ff",
          600: "#005ddb",
          700: "#0049b0",
          800: "#003c8f",
          900: "#043575"
        }
      },
      boxShadow: {
        glow: "0 10px 40px -15px rgba(10, 120, 255, 0.45)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
