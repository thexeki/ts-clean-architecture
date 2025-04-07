import { heroui } from "@heroui/theme";
import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@heroui/theme/dist/components/(button|checkbox|input|modal|pagination|select|skeleton|snippet|spinner|table|toast|ripple|form|listbox|divider|popover|scroll-shadow|spacer).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      colors: {
        prime: "#38c172",
      },
    },
  },

  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
