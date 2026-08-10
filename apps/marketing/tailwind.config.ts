import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1120px" },
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
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06)",
        glow: "0 0 0 1px hsl(var(--teal) / 0.25), 0 16px 48px hsl(var(--teal) / 0.18)",
        soft: "0 24px 64px -24px rgba(15, 27, 51, 0.45)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 90% 70% at 50% -20%, hsl(var(--teal) / 0.28), transparent 55%), radial-gradient(ellipse 55% 45% at 92% 12%, hsl(210 70% 48% / 0.14), transparent 52%), radial-gradient(ellipse 40% 35% at 8% 70%, hsl(var(--teal) / 0.08), transparent 50%)",
        "hero-glow":
          "radial-gradient(ellipse 60% 40% at 70% 80%, hsl(var(--teal) / 0.12), transparent 60%)",
        "grid-fade":
          "linear-gradient(to bottom, transparent 40%, hsl(var(--navy-deep))), linear-gradient(to right, hsl(0 0% 100% / 0.035) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.035) 1px, transparent 1px)",
        "section-fade":
          "linear-gradient(180deg, hsl(var(--mist)) 0%, hsl(220 30% 95%) 100%)",
      },
      backgroundSize: {
        grid: "56px 56px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(40px) scale(0.985)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
        waveform: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.8s ease both",
        rise: "rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
        waveform: "waveform 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
