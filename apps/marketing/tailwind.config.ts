import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "hsl(var(--ink))",
        mist: "hsl(var(--mist))",
        brand: "hsl(var(--teal))",
        "teal-soft": "hsl(var(--teal-soft))",
        navy: "hsl(var(--navy))",
        "navy-deep": "hsl(var(--navy-deep))",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.08)",
        glow: "0 0 0 1px hsl(var(--teal) / 0.2), 0 12px 40px hsl(var(--teal) / 0.15)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--teal) / 0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 0%, hsl(220 80% 60% / 0.12), transparent 50%)",
        "grid-fade":
          "linear-gradient(to bottom, transparent, hsl(var(--navy-deep))), linear-gradient(to right, hsl(0 0% 100% / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% center" },
          to: { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
