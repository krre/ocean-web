import { sendQuery, sendCommand } from "$lib/network";

export interface Vote {
    count: number;
    vote: number;
}

export namespace GetAll {
    export interface Request {
        user_id?: number;
        sort: number;
        limit: number;
        offset: number;
        filter?: number;
        category?: number;
    }

    export interface Mandela {
        after: string;
        before: string;
        comment_count: number;
        create_ts: Date;
        id: number;
        mark_ts: Date;
        title: string;
        title_mode: number;
        user_id: number;
        user_name: string;
        what: string;
        votes: Vote[];
    }

    export interface Response {
        category_count: number;
        mandels: Mandela[];
        mine_count: number;
        new_count: number;
        poll_count: number;
        trash_count: number;
        user_count: number;
        total_count: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "mandela.getAll", params })
    }
}

export namespace Delete {
    export interface Request {
        id: number[];
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "mandela.delete", params })
    }
}

export namespace Create {
    export interface Request {
        title_mode: number;
        title: string;
        what: string;
        before: string;
        after: string;
        description: string;
        categories: number[];
    }

    export interface Response {
        id: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "mandela.create", params })
    }
}

export namespace Update {
    export interface Request {
        id: number;
        title_mode: number;
        title: string;
        what: string;
        before: string;
        after: string;
        description: string;
        categories: number[];
    }

    export interface Response {
        id: number;
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "mandela.update", params })
    }
}


export namespace GetOne {
    export interface Request {
        id: number;
    }

    export interface Mandela {
        after: string;
        before: string;
        create_ts: Date;
        description: string;
        id: number;
        mark_ts: Date;
        title: string;
        title_mode: number;
        update_ts: Date;
        user_id: number;
        user_name: string;
        what: string;
        trash: boolean;
        automatic_trash: boolean;
    }

    export interface Response {
        categories: number[];
        mandela: Mandela;
        vote?: number;
        votes?: Vote[];
    }

    export async function exec(params: Request): Promise<Response> {
        return await sendQuery({ method: "mandela.getOne", params })
    }
}

export namespace Mark {
    export interface Request {
        id: number;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "mandela.mark", params })
    }
}

export namespace Vote {
    export interface Request {
        id: number;
        vote: number;
    }

    export interface Response {
        count: number;
        vote: number;
    }

    export async function exec(params: Request): Promise<Response[]> {
        return await sendQuery({ method: "mandela.vote", params })
    }
}

export namespace GetVoteUsers {
    export interface Request {
        id: number;
    }

    export interface Response {
        id: number;
        name: string;
        vote: number;
    }

    export async function exec(params: Request): Promise<Response[]> {
        return await sendQuery({ method: "mandela.getVoteUsers", params })
    }
}

export namespace UpdateTrash {
    export interface Request {
        id: number;
        trash: boolean;
        automatic_trash: boolean;
    }

    export async function exec(params: Request): Promise<void> {
        return await sendCommand({ method: "mandela.updateTrash", params })
    }
}
