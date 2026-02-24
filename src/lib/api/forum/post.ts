import { sendQuery, sendCommand } from "$lib/network";
import type { ForumTopicPoll } from "$lib/types";

export namespace GetAll {
    export interface Request {
        topic_id: number;
        offset: number;
        limit: number;
    }

    export interface Post {
        create_ts: Date;
        id: number;
        post: string;
        user_id: number;
        user_name: string;
        like_count: number;
        dislike_count: number;
        like?: number;
    }

    export interface Response {
        category_id: number;
        category_name: string;
        post_count: number;
        posts: Post[];
        section_id: number;
        section_name: string;
        topic_name: string;
        topic_type: number,
        topic_user_id: number;
        poll_selection_type?: number;
        poll?: ForumTopicPoll[]
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "forum.post.getAll", params });
    }
}

export namespace Create {
    export interface Request {
        topic_id: number;
        post: string;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "forum.post.create", params });
    }
}

export namespace Update {
    export interface Request {
        id: number;
        post: string;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "forum.post.update", params });
    }
}

export namespace Delete {
    export interface Request {
        id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "forum.post.delete", params });
    }
}
