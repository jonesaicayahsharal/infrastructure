/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["Archivo", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            colors: {
                royal: {
                    950: "#0a0c1a",
                    900: "#0f1229",
                    800: "#1a1f42",
                    700: "#252b5c",
                    600: "#2d3470",
                    500: "#3b44a0",
                    400: "#5a64c8",
                },
                purple: {
                    950: "#1a0a2e",
                    900: "#2d1b4e",
                    800: "#462d6e",
                    700: "#5f3f8e",
                    600: "#7852ae",
                    500: "#9164ce",
                },
                gold: {
                    600: "#b8860b",
                    500: "#d4af37",
                    400: "#e6c453",
                    300: "#f0d77a",
                },
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(20px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-up": {
                    from: { opacity: "0", transform: "translateY(40px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.6s ease-out forwards",
                "slide-up": "slide-up 0.8s ease-out forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
