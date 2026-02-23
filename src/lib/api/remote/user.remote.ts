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

export const updateProfile = command(v.object({ name: v.string(), gender: v.number(), token: v.string() }), async ({ name, gender, token }) => {
    await api.User.UpdateProfile.exec({ name, gender }, token);
})

export const updateToken = command(v.object({ newToken: v.string(), token: v.string() }), async ({ newToken, token }) => {
    await api.User.UpdateToken.exec({ token: newToken }, token);
})

export const update = command(v.object({ id: v.number(), name: v.string(), code: v.string(), gender: v.number(), blocked: v.boolean(), token: v.string() }), async ({ id, name, code, gender, blocked, token }) => {
    await api.User.Update.exec({ id, name, code, gender, blocked }, token);
})

export const del = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    await api.User.Delete.exec({ id }, token);
})
