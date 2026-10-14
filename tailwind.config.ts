import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1e68d7", // Globallink core blue
          600: "#0d55c8",
          700: "#09419e",
          800: "#072f73",
          900: "#08214d",
          950: "#041029",
        },
        navy: {
          800: "#0c1a36",
          900: "#060f24",
          950: "#030814",
        },
        cyan: {
          glow: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-manrope)", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(30, 104, 215, 0.35)",
        card: "0 10px 30px -5px rgba(2, 23, 71, 0.08), 0 4px 12px -2px rgba(2, 23, 71, 0.04)",
        cardHover: "0 20px 40px -10px rgba(2, 23, 71, 0.15), 0 8px 20px -4px rgba(2, 23, 71, 0.08)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
