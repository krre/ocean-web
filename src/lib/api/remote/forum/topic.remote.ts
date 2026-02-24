import * as api from "$lib/api";
import * as v from 'valibot';
import { command } from '$app/server';

export const create = command(v.object({ section_id: v.number(), name: v.string(), type: v.number(), poll_answers: v.optional(v.array(v.string())), poll_answer_selection: v.optional(v.number()) }),
    async ({ section_id, name, type, poll_answers, poll_answer_selection }) => {
        return await api.Forum.Topic.Create.exec({ section_id, name, type, poll_answers, poll_answer_selection });
    });

export const update = command(v.object({ id: v.number(), name: v.string() }), async ({ id, name }) => {
    await api.Forum.Topic.Update.exec({ id, name });
});

export const del = command(v.object({ id: v.number() }), async ({ id }) => {
    await api.Forum.Topic.Delete.exec({ id });
});

export const vote = command(v.object({ id: v.number(), votes: v.array(v.number()) }), async ({ id, votes }) => {
    return await api.Forum.Topic.Vote.exec({ id, votes });
});

export const getVoteUsers = command(v.object({ id: v.number() }), async ({ id }) => {
    return await api.Forum.Topic.GetVoteUsers.exec({ id });
});
