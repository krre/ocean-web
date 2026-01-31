import { writable, get } from 'svelte/store';
import type { UserSession } from './types'
import * as consts from '$lib/consts'
import { PUBLIC_ANONYM_TOKEN } from '$env/static/public';

export const modalDialog = writable(null);
export const userSession = writable<UserSession>(anonymSession())

export function setSession(session: UserSession) {
    userSession.set(session)
}

export function session(): UserSession {
    return get(userSession)
}

export function anonymSession(): UserSession {
    return { id: 0, code: consts.Account.Anonym, name: consts.Account.ModeNames[consts.Account.Anonym], token: PUBLIC_ANONYM_TOKEN, isAdmin: false, isAnonym: true }
}
