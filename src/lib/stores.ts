import { writable, get } from 'svelte/store';
import type { UserSession } from './types'
import * as consts from '$lib/consts'
import { PUBLIC_ANONYM_TOKEN } from '$env/static/public';

interface DialogOptions {
    component: any,
    params?: object
}

export const userSession = writable<UserSession>(anonymSession())
export const modalDialog = writable<DialogOptions>({ component: null });

export function setSession(session: UserSession) {
    userSession.set(session)
}

export function session(): UserSession {
    return get(userSession)
}

export function anonymSession(): UserSession {
    return { id: 0, code: consts.Account.Anonym, name: consts.Account.ModeNames[consts.Account.Anonym], token: PUBLIC_ANONYM_TOKEN, isAdmin: false, isAnonym: true }
}

export function openDialog(component: any, params?: object) {
    modalDialog.set({ component, params });
}

export function closeDialog() {
    modalDialog.set({ component: null });
}
