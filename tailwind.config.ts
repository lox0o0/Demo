import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nrl: {
          // Official NRL Green (primary brand color)
          green: "#00A651",
          // Dark backgrounds (matching NRL official site)
          dark: "#0A0A0A",
          "dark-card": "#141414",
          "dark-hover": "#1A1A1A",
          // Text colors
          "text-primary": "#FFFFFF",
          "text-secondary": "#B3B3B3",
          "text-muted": "#808080",
          // Accent colors
          amber: "#FFB800",
          gold: "#FFD700",
          // Border colors
          "border-light": "rgba(255, 255, 255, 0.1)",
          "border-medium": "rgba(255, 255, 255, 0.15)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "bounce-in": "bounceIn 0.8s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "50%": { transform: "translateY(-20px) rotate(180deg)", opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-strong": "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
