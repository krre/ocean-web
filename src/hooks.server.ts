import type { Handle } from '@sveltejs/kit';
import { loadSession } from '$lib/session-store';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session_id');
    event.locals.session = await loadSession(sessionId);
    return resolve(event);
};
