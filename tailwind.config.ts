import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Forest palette aus shared.jsx — Tannengrün · Kupfer
        paper: "#F3EDE2",
        paperAlt: "#EBE3D3",
        highlight: "#E8DCC2",
        ink: "#1F2A24",
        inkSoft: "#44504A",
        muted: "#7A7164",
        line: "#D8CDB8",
        fir: {
          DEFAULT: "#1E3A34",
          deep: "#162A25",
        },
        copper: {
          DEFAULT: "#C4926B",
          deep: "#A67353",
        },
        // Risk-Ampel
        riskGreen: "#5C8B62",
        riskYellow: "#C4926B",
        riskRed: "#A33B2A",
      },
      fontFamily: {
        serif: ["var(--ak-serif)", "Georgia", "serif"],
        sans: ["var(--ak-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1040px",
      },
      borderRadius: {
        pill: "999px",
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
