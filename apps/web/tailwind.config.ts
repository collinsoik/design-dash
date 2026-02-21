import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: "#FFFFFF",
          secondary: "#F8F9FB",
          tertiary: "#F0F2F5",
        },
        text: {
          primary: "#1A1A2E",
          secondary: "#5C6370",
          tertiary: "#9CA3AF",
          disabled: "#C9CDD3",
        },
        border: {
          primary: "#E2E5EA",
          secondary: "#D0D4DA",
          focus: "#7C8CF5",
        },
        accent: {
          primary: "#7C8CF5",
          "primary-light": "#E8EBFE",
          red: "#F17B8D",
          "red-light": "#FDE8EC",
          green: "#4ACA9A",
          "green-light": "#E3F8F0",
          yellow: "#F0C94B",
          "yellow-light": "#FDF6E0",
          blue: "#5B9BD5",
          "blue-light": "#E6F0FA",
          purple: "#A78BDA",
          "purple-light": "#F0EAFB",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        card: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        elevated: "0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
