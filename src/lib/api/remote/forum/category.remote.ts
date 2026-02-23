import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ name: v.string(), order_index: v.number(), token: v.string() }), async ({ name, order_index, token }) => {
    await api.Forum.Category.Create.exec({ name, order_index }, token);
});

export const update = command(v.object({ id: v.number(), name: v.string(), order_index: v.number(), token: v.string() }), async ({ id, name, order_index, token }) => {
    await api.Forum.Category.Update.exec({ id, name, order_index }, token);
});

export const del = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    await api.Forum.Category.Delete.exec({ id }, token);
});
