import { RequestCreator, type Response, type Error } from "$lib/json-rpc"
import { printMessage } from "$lib/api-error"
import { token } from "$lib/stores"
import { get } from 'svelte/store';

export async function send<Req, Res>(method: string, params?: Req): Promise<Res> {
    const rc = new RequestCreator(method, params);

    const answer = await fetch(`${process.env.OCEAN_API_URL}?token=${get(token)}`, {
        method: "POST",
        body: rc.toString()
    })

    const text = await answer.text();
    const response: Response<Res> = JSON.parse(text);

    if (response.error) {
        throw (response.error);
    }

    if (response.result === undefined || response.result === null) {
        throw new Error("Empty result");
    }

    return response.result;
}

export function errorMessage(error: Error): string {
    return printMessage(error.code, error.message);
}

export function setToken(value: string) {
    token.set(value || String(process.env.ANONYM_TOKEN));
}
