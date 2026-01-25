import { json } from '@sveltejs/kit';
import { saveSession } from '$lib/session-store';
import type { RequestHandler } from './$types';
import uidSafe from 'uid-safe'
import type { UserSession } from '$lib/types';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const session: UserSession = await request.json();
    const sessionId = uidSafe.sync(24)
    saveSession(sessionId, session)

    cookies.set('session_id', sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 365
    });

    return json(true);
};
