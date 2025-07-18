import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
                minjee: {
                    navbar: "hsl(var(--minjee-navbar))",
                },
                camouflage: {
                    "50": "#f4f6f3",
                    "100": "#e7eae1",
                    "200": "#ced5c5",
                    "300": "#abb79e",
                    "400": "#778768",
                    "500": "#637653",
                    "600": "#4b5c3f",
                    "700": "#3c4a32",
                    "800": "#313b2a",
                    "900": "#293123",
                    "950": "#161b13",
                },
            },
            fontFamily: {
                caveat: ["caveat"],
                caveat_semibold: ["caveat-semibold"],
                caveat_bold: ["caveat-bold"],
                caveat_brush: ["caveat-brush"],
                inder: ["inder"],
                afacad: ["afacad", "sans-serif"],
                afacad_medium: ["afacad-medium", "sans-serif"],
                afacad_semibold: ["afacad-semibold", "sans-serif"],
                afacad_bold: ["afacad-bold", "sans-serif"],
                inter: ["inter"],
                interlight: ["interlight"],
                intermedium: ["intermedium"],
                intersemibold: ["intersemibold"],
                interbold: ["interbold"],
                poppins: ["poppins"],
                poppins_medium: ["poppins-medium"],
                poppins_bold: ["poppins-bold"],
                poppins_extrabold: ["poppins-extrabold"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
