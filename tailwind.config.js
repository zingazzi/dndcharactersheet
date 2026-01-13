/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f4e8d0',
        'parchment-dark': '#e8d4b8',
        brown: '#8b4513',
        'brown-dark': '#6b3410',
        'brown-light': '#9d5520',
        'brown-border': '#5c3a21',
        gold: '#d4a574',
        'text-dark': '#2c1810',
        'text-brown': '#5c3a21',
        'green-hp': '#2e7d32',
        'green-hp-dark': '#1b5e20',
        'red-damage': '#8b1a1a',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Georgia', 'Times New Roman', 'serif'],
        'cinzel-decorative': ['Cinzel Decorative', 'Georgia', 'Times New Roman', 'serif'],
        medieval: ['MedievalSharp', 'Georgia', 'Times New Roman', 'serif'],
        uncial: ['Uncial Antiqua', 'Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'dnd': '0 4px 6px rgba(44, 24, 16, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'dnd-lg': '0 8px 12px rgba(44, 24, 16, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.1)',
        'dnd-inner': 'inset 0 2px 4px rgba(44, 24, 16, 0.2)',
      },
      backgroundImage: {
        'parchment-gradient': 'linear-gradient(to bottom, #f4e8d0, #e8d4b8)',
        'parchment-gradient-reverse': 'linear-gradient(to top, #f4e8d0, #e8d4b8)',
      },
      borderWidth: {
        'dnd': '3px',
      },
    },
  },
  plugins: [],
}
