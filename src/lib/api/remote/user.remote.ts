import * as api from "$lib/api";
import * as consts from "$lib/consts";
import * as v from 'valibot';
import { getRequestEvent, command } from '$app/server';
import { saveSession, deleteSession } from '$lib/session-store';
import type { UserSession } from '$lib/types';
import uidSafe from 'uid-safe'

export const login = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    const result = await api.User.Auth.exec({ token }, token);

    const session: UserSession = {
        token: token,
        id: id,
        code: result.code,
        name: result.name,
        isAnonym: false,
        isAdmin: result.code == consts.Account.Admin,
    };

    const sessionId = uidSafe.sync(24)
    await saveSession(sessionId, session)

    const { cookies } = getRequestEvent();

    cookies.set('session_id', sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 365
    });


    return session;
});

export const logout = command(v.string(), async (token) => {
    await api.User.Logout.exec(token);

    const { cookies } = getRequestEvent();
    const sessionId = cookies.get('session_id');

    if (sessionId) {
        cookies.delete("session_id", { path: '/' });
        await deleteSession(sessionId)
    }
});
