import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ title_mode: v.number(), title: v.string(), what: v.string(), before: v.string(), after: v.string(), description: v.string(), categories: v.array(v.number()) }),
    async ({ title_mode, title, what, before, after, description, categories }) => {
        return await api.Mandela.Create.exec({ title_mode, title, what, before, after, description, categories });
    });

export const update = command(v.object({ id: v.number(), title_mode: v.number(), title: v.string(), what: v.string(), before: v.string(), after: v.string(), description: v.string(), categories: v.array(v.number()) }),
    async ({ id, title_mode, title, what, before, after, description, categories }) => {
        await api.Mandela.Update.exec({ id, title_mode, title, what, before, after, description, categories });
    });

export const del = command(v.object({ id: v.array(v.number()) }), async ({ id }) => {
    await api.Mandela.Delete.exec({ id });
})

export const updateTrash = command(v.object({ id: v.number(), trash: v.boolean(), automatic_trash: v.boolean() }),
    async ({ id, trash, automatic_trash }) => {
        await api.Mandela.UpdateTrash.exec({ id, trash, automatic_trash });
    });

export const vote = command(v.object({ id: v.number(), vote: v.number() }), async ({ id, vote }) => {
    return await api.Mandela.Vote.exec({ id, vote });
})

export const getVoteUsers = command(v.object({ id: v.number() }), async ({ id }) => {
    return await api.Mandela.GetVoteUsers.exec({ id });
})
