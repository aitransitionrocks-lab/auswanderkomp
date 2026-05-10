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
        navy: {
          DEFAULT: "#0A1628",
          light: "#1A2E48",
          faint: "#E6F1FB",
        },
        teal: {
          DEFAULT: "#0F6E56",
          mid: "#1D9E75",
          light: "#E1F5EE",
          faint: "#F0FAF6",
        },
        amber: {
          brand: "#BA7517",
          light: "#FAEEDA",
          faint: "#FDF7EC",
        },
        risk: {
          red: "#B91C1C",
          redBg: "#FEE2E2",
          yellow: "#B45309",
          yellowBg: "#FEF3C7",
          green: "#047857",
          greenBg: "#D1FAE5",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
