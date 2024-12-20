/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	// eslint-disable-next-line no-undef
	plugins: [daisyui],
};
