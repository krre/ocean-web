import { sendQuery } from "$lib/network";

export namespace GetMandels {
    export interface Request {
        vote: number;
        limit: number;
        offset: number;
    }

    export interface Mandela {
        after: string;
        before: string;
        count: number;
        id: number;
        title: string;
        title_mode: number;
        what: string;
    }

    export interface Response {
        mandels: Mandela[];
        total_count: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "rating.getMandels", params });
    }
}

export namespace GetUsers {
    export interface Request {
        limit: number;
        offset: number;
    }

    export interface User {
        count: number;
        id: number;
        name: string;
    }

    export interface Response {
        user_count: number;
        users: User[];
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "rating.getUsers", params });
    }
}
