import { sendQuery, sendCommand } from "$lib/network";
import type { LikeAction } from "$lib/types"

export namespace Create {
    export interface Request {
        comment_id?: number
        post_id?: number
        action: LikeAction;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "like.create", params });
    }
}

export namespace Delete {
    export interface Request {
        comment_id?: number
        post_id?: number
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "like.delete", params });
    }
}

export namespace GetUsers {
    export interface Request {
        comment_id?: number
        post_id?: number
    }

    export interface Response {
        id: number;
        name: string;
        action: LikeAction;
    }

    export async function exec(params: Request): Promise<Response[]> {
        return await sendQuery({ method: "like.getUsers", params });
    }
}
