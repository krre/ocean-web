import { sendQuery } from "$lib/network";

export enum TitleType {
    Mandela = "mandela",
    Topic = "topic",
    Comment = "comment",
    Post = "post",
}

export interface Feed {
    id: number;
    row: number;
    title_id: number;
    title: string;
    message: string;
    user_id: number;
    user_name: string;
    create_ts: Date;
    type: TitleType;
}

export namespace GetAll {
    export interface Request {
        limit: number;
        offset: number;
    }

    export interface Response {
        feeds: Feed[]
        total_count: number;
    }

    export async function exec(params: Request, token: string): Promise<Response> {
        return await sendQuery({ method: "feed.getAll", params, token });
    }
}
