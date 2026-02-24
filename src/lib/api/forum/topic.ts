import { sendQuery, sendCommand } from "$lib/network";
import type { ForumTopicType, ForumPollAnswerSelection, ForumTopicPoll } from "$lib/types"

export namespace GetAll {
    export interface Request {
        section_id: number;
        offset: number;
        limit: number;
    }

    export interface Topic {
        id: number;
        name: string;
        type: number;
        user_id: number;
        user_name: string;
        post_count: number;
        create_ts: Date;
        last_post_id?: number;
        last_post_create_ts?: Date;
    }

    export interface Response {
        category_id: number;
        category_name: string;
        section_name: string;
        topic_count: number;
        topics: Topic[];
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "forum.topic.getAll", params });
    }
}

export namespace GetOne {
    export interface Request {
        id: number;
    }

    export interface Response {
        user_id: number;
        name: string;
        section_id: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "forum.topic.getOne", params });
    }
}

export namespace Create {
    export interface Request {
        name: string;
        section_id: number;
        type: ForumTopicType;
        poll_answers?: string[];
        poll_answer_selection?: ForumPollAnswerSelection;
    }

    export interface Response {
        id: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "forum.topic.create", params });
    }
}

export namespace Update {
    export interface Request {
        id: number;
        name: string;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "forum.topic.update", params });
    }
}

export namespace Delete {
    export interface Request {
        id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "forum.topic.delete", params });
    }
}

export namespace Vote {
    export interface Request {
        id: number;
        votes: number[];
    }

    export interface Response {
        poll: ForumTopicPoll[];
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "forum.topic.vote", params });
    }
}

export namespace GetVoteUsers {
    export interface Request {
        id: number;
    }

    export interface Response {
        id: number;
        name: string;
        answer_id: number;
    }

    export async function exec(params: Request): Promise<Response[]> {
        return await sendQuery({ method: "forum.topic.getVoteUsers", params });
    }
}
