import * as api from "$lib/api";
import * as v from 'valibot';
import * as comments from "$lib/comments"
import { command } from '$app/server';

export const create = command(v.object({ mandela_id: v.number(), message: v.string() }), async ({ mandela_id, message }) => {
    await api.Comment.Create.exec({ mandela_id, message });
});

export const getAll = command(v.object({ mandelaId: v.number(), pageNo: v.number() }), async ({ mandelaId, pageNo }) => {
    return await comments.loadComments(mandelaId, pageNo);
});

export const update = command(v.object({ id: v.number(), message: v.string() }), async ({ id, message }) => {
    await api.Comment.Update.exec({ id, message });
});

export const del = command(v.object({ id: v.number() }), async ({ id }) => {
    await api.Comment.Delete.exec({ id });
});
