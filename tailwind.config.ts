import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: "#C98F78",
          hover: "#B87F69",
          light: "#D8A38F",
        },
        sand: {
          DEFAULT: "#F4EBDD",
          light: "#FAF5EE",
          dark: "#E2D3BE",
        },
        ink: {
          DEFAULT: "#2B211B",
          warm: "#1C1614",
          deep: "#140F0D",
        },
        gold: {
          50: "#FAF6ED",
          100: "#F3EAD5",
          200: "#E7D4AA",
          300: "#D9BC7F",
          400: "#C5A059", // Core brand gold
          500: "#AF8A43",
          600: "#927032",
          700: "#755624",
          800: "#583F19",
          900: "#3D2B10",
        },
        safari: {
          night: "#0B0E0C",
          dark: "#141814",
          charcoal: "#1D231E",
          card: "#18201A",
          surface: "#222B24",
          border: "#2C372E",
          stone: "#64675E",
          sand: "#EFE8DC",
          cream: "#FAF7F2",
          paper: "#F5EFE6",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      letterSpacing: {
        widest: ".2em",
        ultra: ".3em",
      },
      boxShadow: {
        editorial: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
        luxury: "0 30px 60px -12px rgba(11, 14, 12, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
