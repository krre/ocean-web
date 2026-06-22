import type { Handle } from '@sveltejs/kit';
import { loadSession } from '$lib/session-store';
import { GOOGLE_ANALYTICS_ID } from '$app/env/public';

process.on('unhandledRejection', (reason, promise) => {
	console.error('--- DETAILED ERROR ---');
	console.error('Reason:', reason);
	console.error('Promise:', promise);
	console.error('-----------------------');
});

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');
	event.locals.session = await loadSession(sessionId);

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			if (!GOOGLE_ANALYTICS_ID) {
				return html.replace('%sveltekit.analytics%', '');
			}

			const analyticsScript = `
					<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}"></script>
					<script>
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${GOOGLE_ANALYTICS_ID}');
					</script>`;

			return html.replace('%sveltekit.analytics%', analyticsScript);
		}
	});
};
