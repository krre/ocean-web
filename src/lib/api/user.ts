import { sendQuery, sendCommand } from "$lib/network";

export namespace GetOne {
    export interface Request {
        id: number;
    }

    export interface Response {
        code: string;
        create_ts: Date;
        id: number;
        name: string;
        gender: number;
        blocked: boolean;
        mandela_count: number;
        comment_count: number;
        forum_topic_count: number;
        forum_post_count: number;
        like_count: number;
        dislike_count: number;
    }

    export async function exec(params: Request, token: string): Promise<Response> {
        return await sendQuery({ method: "user.getOne", params, token });
    }
}

export namespace Create {
    export interface Request {
        id: number,
        name: string,
        code: string,
        token: string,
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "user.create", params, token });
    }
}

export namespace Delete {
    export interface Request {
        id: number,
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "user.delete", params, token });
    }
}

export namespace Update {
    export interface Request {
        id: number;
        code: string;
        name: string;
        gender: number;
        blocked: boolean;
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "user.update", params, token });
    }
}

export namespace UpdateProfile {
    export interface Request {
        name: string;
        gender: number;
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "user.updateProfile", params, token });
    }
}

export namespace UpdateToken {
    export interface Request {
        token: string;
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "user.updateToken", params, token });
    }
}

export namespace GetNextId {
    export interface Response {
        id: number;
    }

    export async function exec(token: string): Promise<Response> {
        return await sendQuery({ method: "user.getNextId", token })
    }
}

export namespace Auth {
    export interface Request {
        token: string;
    }

    export interface Response {
        code: string,
        name: string,
    }

    export async function exec(params: Request, token: string): Promise<Response> {
        return await sendQuery({ method: "user.auth", params, token });
    }
}

export namespace Logout {
    export async function exec(token: string): Promise<void> {
        return await sendCommand({ method: "user.logout", token });
    }
}
