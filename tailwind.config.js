/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				primary: colors.purple,
				secondary: colors.sky,
			},
			fontFamily: {
				sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
				//  sans: ["Mona Sans", "sans-serif"],
				//         heading: ["Hubot Sans", "sans-serif"],
				//         mono: ["JetBrains Mono", "monospace"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
	darkMode: "class",
	important: true,
};
