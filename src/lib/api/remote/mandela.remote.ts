import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ title_mode: v.number(), title: v.string(), what: v.string(), before: v.string(), after: v.string(), description: v.string(), categories: v.array(v.number()), token: v.string() }),
    async ({ title_mode, title, what, before, after, description, categories, token }) => {
        return await api.Mandela.Create.exec({ title_mode, title, what, before, after, description, categories }, token);
    });

export const update = command(v.object({ id: v.number(), title_mode: v.number(), title: v.string(), what: v.string(), before: v.string(), after: v.string(), description: v.string(), categories: v.array(v.number()), token: v.string() }),
    async ({ id, title_mode, title, what, before, after, description, categories, token }) => {
        await api.Mandela.Update.exec({ id, title_mode, title, what, before, after, description, categories }, token);
    });

export const del = command(v.object({ id: v.array(v.number()), token: v.string() }), async ({ id, token }) => {
    await api.Mandela.Delete.exec({ id }, token);
})

export const updateTrash = command(v.object({ id: v.number(), trash: v.boolean(), automatic_trash: v.boolean(), token: v.string() }),
    async ({ id, trash, automatic_trash, token }) => {
        await api.Mandela.UpdateTrash.exec({ id, trash, automatic_trash }, token);
    });

export const vote = command(v.object({ id: v.number(), vote: v.number(), token: v.string() }), async ({ id, vote, token }) => {
    return await api.Mandela.Vote.exec({ id, vote }, token);
})

export const getVoteUsers = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    return await api.Mandela.GetVoteUsers.exec({ id }, token);
})
