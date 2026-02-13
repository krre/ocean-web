import { sendQuery, sendCommand } from "$lib/network";

interface CategoryData {
    name: string;
    order_index: number;
}

export namespace GetOne {
    export interface Request {
        id: number;
    }

    export interface Response extends CategoryData { }

    export async function exec(params: Request, token: string): Promise<Response> {
        return await sendQuery({ method: "forum.category.getOne", params, token });
    }
}

export namespace Create {
    export interface Request extends CategoryData { }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "forum.category.create", params, token });
    }
}

export namespace Update {
    export interface Request extends CategoryData {
        id: number;
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "forum.category.update", params, token });
    }
}

export namespace Delete {
    export interface Request {
        id: number;
    }

    export async function exec(params: Request, token: string): Promise<void> {
        return await sendCommand({ method: "forum.category.delete", params, token });
    }
}
