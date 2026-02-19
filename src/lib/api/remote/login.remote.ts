import * as api from "$lib/api";
import * as consts from "$lib/consts";
import { command } from '$app/server';
import type { UserSession } from '$lib/types';
import * as v from 'valibot';

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

    return session;
});
