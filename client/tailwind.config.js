import flowbiteReact from 'flowbite-react/plugin/tailwindcss';

/** @type {import('tailwindcss').Config} */

export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'node_modules/flowbite-react/lib/**/*.{js,ts,jsx,tsx}',
		'.flowbite-react/class-list.json',
	],
	theme: {
		extend: {
			colors: {
				primaryBg: '#00a300',
				secondBg: '#1e90ff',
				primary: '#4caf50',
				secondary: '#00bf63',
				textPrimary: '#000000',
				textSecondary: '#757575',
				textTertiary: '#9e9e9e',
				textQuaternary: '#e5e5e5',
			},
		},
		screens: {
			sm: '360px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		fontFamily: {
			Roboto: ['Roboto', 'sans-serif'],
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '12px',
				md: '32px',
			},
		},
		keyframes: {
			progress: {
				'0%': { width: '0%' },
				'100%': { width: '100%' },
			},
			dotBounce: {
				'0%, 20%, 50%, 80%, 100%': {
					transform: 'translateY(0)',
				},
				'40%': {
					transform: 'translateY(-10px)',
				},
				'60%': {
					transform: 'translateY(-5px)',
				},
			},
		},
		animation: {
			loading: 'progress 2s linear infinite',
			'dot-bounce-1': 'dotBounce 1.5s infinite ease-in-out',
			'dot-bounce-2': 'dotBounce 1.5s infinite ease-in-out 0.3s',
			'dot-bounce-3': 'dotBounce 1.5s infinite ease-in-out 0.6s',
		},
	},

	plugins: [flowbiteReact],
};
