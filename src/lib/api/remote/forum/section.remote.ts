import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ category_id: v.number(), name: v.string(), order_index: v.number() }), async ({ category_id, name, order_index }) => {
    await api.Forum.Section.Create.exec({ category_id, name, order_index });
});

export const update = command(v.object({ id: v.number(), name: v.string(), order_index: v.number() }), async ({ id, name, order_index }) => {
    await api.Forum.Section.Update.exec({ id, name, order_index });
});

export const del = command(v.object({ id: v.number() }), async ({ id }) => {
    await api.Forum.Section.Delete.exec({ id });
});
