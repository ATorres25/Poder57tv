/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poderblue: "#2563eb", // azul base (ajustable al logo)
      },
      keyframes: {
        glowFloat: {
          "0%, 100%": {
            transform: "translateY(0px)",
            opacity: "0.55",
          },
          "50%": {
            transform: "translateY(-18px)",
            opacity: "0.8",
          },
        },
      },
      animation: {
        "glow-float": "glowFloat 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
