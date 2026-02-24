import { sendQuery } from "$lib/network";

export namespace GetAll {
    export interface Request {
        text: string;
        type: number;
        limit: number;
        offset: number;
    }

    export interface Record {
        title_id: number;
        title: string;
        id: number;
        row: number;
        content: string;
    }

    export interface Response {
        records: Record[];
        total_count: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "search.getAll", params });
    }
}
