/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
          light: "#A5B4FC",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
        },
        accent: {
          DEFAULT: "#22D3EE",
        },
        ink: "#1E1B4B",
        body: "#475569",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
        },
        border: "#E2E8F0",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        "brand-gradient-radial": "radial-gradient(circle at top left, #6366F1, #8B5CF6 60%)",
      },
      boxShadow: {
        brand: "0 10px 30px -10px rgba(99, 102, 241, 0.35)",
        "brand-lg": "0 20px 45px -12px rgba(99, 102, 241, 0.4)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "18px",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.95)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        blob: "blob 12s infinite ease-in-out",
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
