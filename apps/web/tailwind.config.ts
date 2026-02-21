import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "game-dark": "#1a1a2e",
        "game-red": "#e94560",
        "game-blue": "#0f3460",
        "game-green": "#16c79a",
        "game-yellow": "#f5c518",
        "game-purple": "#9b59b6",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        sans: ["Inter", "sans-serif"],
      },
      borderWidth: {
        "3": "3px",
        "4": "4px",
      },
    },
  },
  plugins: [],
};

export default config;
