/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mercu: {
          dark: "#05070f", // Fondo oscuro premium con tinte azul profundo
          "dark-card": "#0c0f1d", // Fondo de tarjetas azul-oscuro profundo
          cream: "#f5f0e8", // Texto principal crema
          warm: "#ffcd28", // Amarillo Oficial Mercurio
          accent: "#eb2891", // Rosa Oficial Mercurio (Acento dinámico)
          accent2: "#1e3773", // Azul Rey Oficial Mercurio (Base de marca)
          green: "#aacd46", // Verde Oficial Mercurio
          muted: "#7d859d", // Texto secundario gris azulado balanceado
        }
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      animation: {
        'fade-up': 'fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 2s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
