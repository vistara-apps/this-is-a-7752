/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(214 78% 47%)',
        primary: 'hsl(220 40% 16%)',
        surface: 'hsl(0 0% 100%)',
        background: 'hsl(210 20% 98%)',
        'text-primary': 'hsl(220 13% 13%)',
        'text-secondary': 'hsl(220 8% 46%)',
        // Dark theme colors
        'dark-bg': 'hsl(222 84% 5%)',
        'dark-surface': 'hsl(222 47% 11%)',
        'dark-border': 'hsl(217 33% 17%)',
        'dark-text': 'hsl(210 40% 98%)',
        'dark-text-secondary': 'hsl(215 20% 65%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'lg': '24px',
        'md': '16px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 13%, 13%, 0.08)',
        'dark-card': '0 4px 12px hsla(0, 0%, 0%, 0.3)',
      },
    },
  },
  plugins: [],
}