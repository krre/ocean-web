import { defineEnvVars } from '@sveltejs/kit/hooks';

export const variables = defineEnvVars({
	OCEAN_API_URL: {
		public: true
	},
	ANONYM_TOKEN: {
		public: true
	},
	ANONYM_ALLOWED: {
		public: true
	},
	GOOGLE_ANALYTICS_ID: {
		public: true
	}
});
