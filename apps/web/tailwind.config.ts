import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        page: "#0A0A0B",
        card: "#141417",
        "card-hover": "#1A1A1D",
        recessed: "#111113",
        "border-subtle": "#1F1F23",
        "border-visible": "#2A2A2E",
        "text-primary": "#FFFFFF",
        "text-secondary": "#ADADB0",
        "text-tertiary": "#6B6B70",
        "text-muted": "#4A4A4E",
        accent: "#FF5C00",
        "accent-light": "#FF8A4C",
        "accent-tint": "rgba(255, 92, 0, 0.094)",
        success: "#22C55E",
        error: "#EF4444",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        "list-item": "10px",
        nav: "8px",
        btn: "6px",
        badge: "100px",
      },
      spacing: {
        "content-pad": "40px",
        "section-gap": "32px",
        "card-gap": "16px",
        "card-pad": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
