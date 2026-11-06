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
        cbg: {
          navy: "#0A192F",
          blue: "#112240",
          gold: "#D4AF37",
          amber: "#F59E0B",
          light: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
export default config;

