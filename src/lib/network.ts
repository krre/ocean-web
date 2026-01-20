import { RequestCreator, type Response, type Error } from "$lib/json-rpc"
import { printMessage } from "$lib/api-error"
import { session } from "./stores";
import { PUBLIC_OCEAN_API_URL } from '$env/static/public';

export async function send<Req, Res>(method: string, params?: Req): Promise<Res> {
    const rc = new RequestCreator(method, params);

    const answer = await fetch(`${PUBLIC_OCEAN_API_URL}?token=${session().token}`, {
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
