import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        red: "var(--color-red)",
        redHover: "var(--color-red-hover)",
        redLight: "var(--color-red-light)",
        orange: "var(--color-orange)",
        orangeLight: "var(--color-orange-light)",
        orangeDark: "var(--color-orange-dark)",
      },
    },
  },
  plugins: [],
} satisfies Config;
