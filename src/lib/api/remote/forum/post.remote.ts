import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ topic_id: v.number(), post: v.string() }), async ({ topic_id, post }) => {
    await api.Forum.Post.Create.exec({ topic_id, post });
});

export const update = command(v.object({ id: v.number(), post: v.string() }), async ({ id, post }) => {
    await api.Forum.Post.Update.exec({ id, post });
});

export const del = command(v.object({ id: v.number() }), async ({ id }) => {
    await api.Forum.Post.Delete.exec({ id });
});
