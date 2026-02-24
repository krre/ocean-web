import * as api from "$lib/api";
import * as consts from "$lib/consts";
import * as v from 'valibot';
import { getRequestEvent, command } from '$app/server';
import { saveSession, deleteSession } from '$lib/session-store';
import type { UserSession } from '$lib/types';
import uidSafe from 'uid-safe'

export const login = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    const result = await api.User.Auth.exec({ token });

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

export const logout = command(async () => {
    await api.User.Logout.exec();

    const { cookies } = getRequestEvent();
    const sessionId = cookies.get('session_id');

    if (sessionId) {
        cookies.delete("session_id", { path: '/' });
        await deleteSession(sessionId)
    }
});

export const getNextId = command(async () => {
    return await api.User.GetNextId.exec();
})

export const create = command(v.object({ id: v.number(), name: v.string(), code: v.string(), token: v.string() }), async ({ id, name, code, token }) => {
    await api.User.Create.exec({ id, name, code, token });
});

export const updateProfile = command(v.object({ name: v.string(), gender: v.number() }), async ({ name, gender }) => {
    await api.User.UpdateProfile.exec({ name, gender });
})

export const updateToken = command(v.object({ newToken: v.string() }), async ({ newToken }) => {
    await api.User.UpdateToken.exec({ token: newToken });
})

export const update = command(v.object({ id: v.number(), name: v.string(), code: v.string(), gender: v.number(), blocked: v.boolean() }), async ({ id, name, code, gender, blocked }) => {
    await api.User.Update.exec({ id, name, code, gender, blocked });
})

export const del = command(v.object({ id: v.number() }), async ({ id }) => {
    await api.User.Delete.exec({ id });
})
