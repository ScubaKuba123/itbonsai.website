import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090d0c",
        "ink-soft": "#0f1513",
        parchment: "#f0eee6",
        moss: "#84b877",
        gold: "#d9ae5a",
        cyan: "#68c9d0",
      },
    },
  },
  plugins: [],
};

export default config;
