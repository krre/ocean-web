import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ topic_id: v.number(), post: v.string(), token: v.string() }), async ({ topic_id, post, token }) => {
    await api.Forum.Post.Create.exec({ topic_id, post }, token);
});

export const update = command(v.object({ id: v.number(), post: v.string(), token: v.string() }), async ({ id, post, token }) => {
    await api.Forum.Post.Update.exec({ id, post }, token);
});

export const del = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    await api.Forum.Post.Delete.exec({ id }, token);
});
