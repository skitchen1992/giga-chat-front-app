/// <reference types="vitest/config" />

import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

export default defineConfig(() => ({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
			'@/app': path.resolve(import.meta.dirname, './src/app'),
			'@/pages': path.resolve(import.meta.dirname, './src/pages'),
			'@/widgets': path.resolve(import.meta.dirname, './src/widgets'),
			'@/features': path.resolve(import.meta.dirname, './src/features'),
			'@/entities': path.resolve(import.meta.dirname, './src/entities'),
			'@/shared': path.resolve(import.meta.dirname, './src/shared')
		}
	},
	test: {
		bail: 1,
		clearMocks: true,
		coverage: {
			enabled: true,
			exclude: ['src/app/main.tsx'],
			include: ['src/**/*'],
			reporter: ['text', 'lcov'],
			reportsDirectory: 'coverage',
			thresholds: {
				'100': true
			}
		},
		css: false,
		environment: 'happy-dom',
		globals: true,
		include: ['src/**/*.test.ts?(x)'],
		setupFiles: []
	}
}))
