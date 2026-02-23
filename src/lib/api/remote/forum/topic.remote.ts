import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ section_id: v.number(), name: v.string(), type: v.number(), poll_answers: v.optional(v.array(v.string())), poll_answer_selection: v.optional(v.number()), token: v.string() }),
    async ({ section_id, name, type, poll_answers, poll_answer_selection, token }) => {
        return await api.Forum.Topic.Create.exec({ section_id, name, type, poll_answers, poll_answer_selection }, token);
    });

export const update = command(v.object({ id: v.number(), name: v.string(), token: v.string() }), async ({ id, name, token }) => {
    await api.Forum.Topic.Update.exec({ id, name }, token);
});

export const del = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    await api.Forum.Topic.Delete.exec({ id }, token);
});

export const vote = command(v.object({ id: v.number(), votes: v.array(v.number()), token: v.string() }), async ({ id, votes, token }) => {
    return await api.Forum.Topic.Vote.exec({ id, votes }, token);
});

export const getVoteUsers = command(v.object({ id: v.number(), token: v.string() }), async ({ id, token }) => {
    return await api.Forum.Topic.GetVoteUsers.exec({ id }, token);
});
