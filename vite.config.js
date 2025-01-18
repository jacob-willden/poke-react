import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/378#issuecomment-768816653
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				javascript: resolve(__dirname, 'javascript/index.html')
			},
			output: {
				entryFileNames: "assets/[name].js"
			}
		}
	}
})