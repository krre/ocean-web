import { defineEnvVars } from '@sveltejs/kit/hooks';

export const variables = defineEnvVars({
	OCEAN_API_URL: {
		public: true,
		static: true
	},
	ANONYM_TOKEN: {
		public: true,
		static: true
	},
	ANONYM_ALLOWED: {
		public: true,
		static: true
	},
	GOOGLE_ANALYTICS_ID: {
		public: true,
		static: true
	}
});
