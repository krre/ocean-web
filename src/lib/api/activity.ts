import { sendQuery } from "$lib/network";

export interface Comment {
    id: number;
    mandela_id: number;
    title_mode: number;
    title: string;
    what: string;
    before: string;
    after: string;
    message: string;
    user_id: number;
    user_name: string;
    create_ts: Date;
    comment_count: number;
}

export interface Topic {
    id: number;
    name: string;
    post_id: number;
    post: string;
    post_count: number;
    post_create_ts: Date;
    user_id: number;
    user_name: string;
}

export namespace GetAll {
    export interface Request {
        limit: number;
    }

    export interface Response {
        comments: Comment[]
        topics: Topic[]
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "activity.getAll", params });
    }
}
