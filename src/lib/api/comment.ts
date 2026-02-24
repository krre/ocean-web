import { sendQuery, sendCommand } from "$lib/network";

export namespace GetAll {
    export interface Request {
        mandela_id: number;
        limit: number;
        offset: number;
    }

    export interface Comment {
        id: number;
        message: string;
        user_id: number;
        user_name: string;
        like_count: number;
        dislike_count: number;
        like?: number;
        create_ts: Date;
        update_ts: Date;
    }

    export interface Response {
        comments: Comment[];
        total_count: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "comment.getAll", params });
    }
}

export namespace Create {
    export interface Request {
        mandela_id: number;
        message: string;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "comment.create", params });
    }
}

export namespace Update {
    export interface Request {
        id: number;
        message: string;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "comment.update", params });
    }
}

export namespace Delete {
    export interface Request {
        id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "comment.delete", params });
    }
}
