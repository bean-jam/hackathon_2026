import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gatwick-blue': '#005EB8',
        'gatwick-orange': '#FF6B00',
        'gatwick-sky': '#E8F4FC',
      },
    },
  },
  plugins: [],
};

export default config;