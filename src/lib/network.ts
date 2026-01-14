import { RequestCreator, type Response, type Error } from "$lib/json-rpc"
import { printMessage } from "$lib/api-error"
import { token } from "$lib/stores"
import { get } from 'svelte/store';

export async function send<Req, Res>(method: string, params?: Req): Promise<Res> {
    const rc = new RequestCreator(method, params);

    return await fetch(`${process.env.OCEAN_API_URL}?token=${get(token)}`, {
        method: "POST",
        body: rc.toString()
    }).then(r => r.text())
        .then((json: string) => {
            const response: Response<Res> = JSON.parse(json);

            if (response.error) {
                throw (response.error);
            } else {
                return response.result || null;
            }
        });
}

export function errorMessage(error: Error): string {
    return printMessage(error.code, error.message);
}

export function setToken(value: string) {
    token.set(value || String(process.env.ANONYM_TOKEN));
}
