import type { Handle } from '@sveltejs/kit';
import { loadSession } from '$lib/session-store';
import { PUBLIC_GA_ID } from '$env/static/public';

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
			if (!PUBLIC_GA_ID) {
				return html.replace('%sveltekit.analytics%', '');
			}

			const analyticsScript = `
					<script async src="https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_ID}"></script>
					<script>
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${PUBLIC_GA_ID}');
					</script>`;

			return html.replace('%sveltekit.analytics%', analyticsScript);
		}
	});
};
