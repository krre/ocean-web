import { sendQuery, sendCommand } from "$lib/network";

export namespace GetAll {
    export interface Request {
        category_id: number;
    }

    export interface Section {
        id: number;
        name: string;
        topic_count: number;
        post_count: number;
    }

    export interface Response {
        category_name: string;
        sections: Section[];
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery("forum.section.getAll", params)
    }
}

interface SectionData {
    name: string;
    order_index: number;
}

export namespace GetOne {
    export interface Request {
        id: number;
    }

    export interface Response extends SectionData {
        category_id: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery("forum.section.getOne", params)
    }
}

export namespace Create {
    export interface Request extends SectionData {
        category_id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand("forum.section.create", params)
    }
}

export namespace Update {
    export interface Request extends SectionData {
        id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand("forum.section.update", params)
    }
}

export namespace Delete {
    export interface Request {
        id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand("forum.section.delete", params)
    }
}
