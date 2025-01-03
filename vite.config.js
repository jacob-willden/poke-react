import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
    // © 2024 Rafał Goławski, released under the Universal Permissive License version 1.0
	build: {
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].js"
			}
		}
	}
})