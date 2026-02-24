import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ comment_id: v.optional(v.number()), post_id: v.optional(v.number()), action: v.number() }), async ({ comment_id, post_id, action }) => {
    await api.Like.Create.exec({ comment_id, post_id, action });
});

export const del = command(v.object({ comment_id: v.optional(v.number()), post_id: v.optional(v.number()) }), async ({ comment_id, post_id }) => {
    await api.Like.Delete.exec({ comment_id, post_id });
});

export const getUsers = command(v.object({ comment_id: v.optional(v.number()), post_id: v.optional(v.number()) }), async ({ comment_id, post_id }) => {
    return await api.Like.GetUsers.exec({ comment_id, post_id });
});
