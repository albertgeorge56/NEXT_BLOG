import type { Config } from "tailwindcss";

const config: Config = {
  corePlugins: {
    preflight: false, // Disable Tailwind preflight
  },
  darkMode: ["class", '[data-mantine-color-scheme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e1f8ff",
          100: "#cbedff",
          200: "#9ad7ff",
          300: "#64c1ff",
          400: "#3aaefe",
          500: "#20a2fe",
          600: "#099cff",
          700: "#0088e4",
          800: "#0079cd",
          900: "#0068b6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
