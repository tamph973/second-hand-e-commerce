import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import flowbiteReact from 'flowbite-react/plugin/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), flowbiteReact()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	server: {
		proxy: {
			'/api/provinces': {
				target: 'https://provinces.open-api.vn/api/v1/',
				changeOrigin: true,
			},
		},
	},
});
