import * as api from "$lib/api";
import * as v from 'valibot';
import * as comments from "$lib/comments"
import { command } from '$app/server';

export const create = command(v.object({ mandela_id: v.number(), message: v.string(), token: v.string() }), async ({ mandela_id, message, token }) => {
    await api.Comment.Create.exec({ mandela_id, message }, token);
});

export const getAll = command(v.object({ mandelaId: v.number(), pageNo: v.number(), token: v.string() }), async ({ mandelaId, pageNo, token }) => {
    return await comments.loadComments(mandelaId, pageNo, token);
});

export const update = command(v.object({ id: v.number(), message: v.string(), token: v.string() }), async ({ id, message, token }) => {
    await api.Comment.Update.exec({ id, message }, token);
});

export const del = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    await api.Comment.Delete.exec({ id }, token);
});
