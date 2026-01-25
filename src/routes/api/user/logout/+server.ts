import { json } from '@sveltejs/kit';
import { deleteSession } from '$lib/session-store';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get('session_id');

    if (!sessionId) {
        return json(true)
    }

    cookies.delete("session_id", { path: '/' });
    deleteSession(sessionId)

    return json(true);
};
