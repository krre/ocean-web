import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ comment_id: v.optional(v.number()), post_id: v.optional(v.number()), action: v.number(), token: v.string() }), async ({ comment_id, post_id, action, token }) => {
    await api.Like.Create.exec({ comment_id, post_id, action }, token);
});

export const del = command(v.object({ comment_id: v.optional(v.number()), post_id: v.optional(v.number()), token: v.string() }), async ({ comment_id, post_id, token }) => {
    await api.Like.Delete.exec({ comment_id, post_id }, token);
});

export const getUsers = command(v.object({ comment_id: v.optional(v.number()), post_id: v.optional(v.number()), token: v.string() }), async ({ comment_id, post_id, token }) => {
    return await api.Like.GetUsers.exec({ comment_id, post_id }, token);
});
