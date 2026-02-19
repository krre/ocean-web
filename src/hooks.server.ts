import type { Handle } from '@sveltejs/kit';
import { loadSession } from '$lib/session-store';

process.on('unhandledRejection', (reason, promise) => {
    console.error('--- DETAILED ERROR ---');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    console.error('-----------------------');
});

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session_id');
    event.locals.session = await loadSession(sessionId);
    return resolve(event);
};
