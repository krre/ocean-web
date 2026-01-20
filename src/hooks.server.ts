import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/session-store';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session_id');
    console.log("sessionId", sessionId)
    event.locals.session = await getSession(sessionId);
    return resolve(event);
};
