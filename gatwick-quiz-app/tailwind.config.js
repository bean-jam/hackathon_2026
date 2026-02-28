import type { MyType } from './types';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EXACT NAMES MATCHING YOUR PAGE
        'gatwick-viking': '#61AFDF',
        'gatwick-congress-blue': '#004990',
        'gatwick-teal': '#009898',
        'gatwick-orange': '#F58220',
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "sans-serif"],
        mono: ["var(--font-montserrat)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;