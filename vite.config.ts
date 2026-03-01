import devtoolsJson from 'vite-plugin-devtools-json';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		server: {
			port: 3000,
			https: {
				key: fs.readFileSync(path.resolve(env.SSL_KEY_PATH)),
				cert: fs.readFileSync(path.resolve(env.SSL_CERT_PATH)),
			},
		},
		plugins: [sveltekit(), devtoolsJson()],
		test: {
			expect: { requireAssertions: true },
			projects: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						browser: {
							enabled: true,
							provider: playwright(),
							instances: [{ browser: 'chromium', headless: true }]
						},
						include: [
							'src/**/*.svelte.{test,spec}.{js,ts}',
							'tests/**/*.{test,spec}.{js,ts}'
						],
						exclude: ['src/lib/server/**']
					}
				},

				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		}
	}
});
