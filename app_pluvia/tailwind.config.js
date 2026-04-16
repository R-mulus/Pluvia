const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit_400Regular"],
        "outfit-bold": ["Outfit_700Bold"],
        "outfit-medium": ["Outfit_500Medium"],
      },
      colors: {
        /* ----- CORES PADRÃO DO REUSABLES (NÃO MEXER) ----- */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* -----  CORES DO FIGMA PLUVIA ----- */
        // Usamos var() direto pois os hexadecimais estarão no global.css
        bg: "var(--bg)",
        medio: "var(--bg-medio)", // Background médio
        leve: "var(--bg-leve)", // Background leve
        texto: "var(--texto)",
        subtexto: "var(--subtexto)",
        "primaria-azul": "var(--primaria-azul)",
        "secundaria-azul": "var(--secundaria-azul)",
        "primaria-verde": "var(--primaria-verde)",
        "secundaria-verde": "var(--secundaria-verde)",
        "acentuacao-1": "var(--acentuacao-1)",
        "acentuacao-2": "var(--acentuacao-2)",
        correto: "var(--correto)",
        incorreto: "var(--incorreto)",
        borda: "var(--borda)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
};
