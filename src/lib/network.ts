import { RequestCreator, type Response, type Error } from "$lib/json-rpc"
import { printMessage } from "$lib/api-error"
import { PUBLIC_OCEAN_API_URL } from '$env/static/public';

export interface RequestOptions<Req> {
    method: string,
    token: string,
    params?: Req
}

async function send<Req, Res>(options: RequestOptions<Req>): Promise<Res | void> {
    const rc = new RequestCreator(options.method, options.params);

    const answer = await fetch(`${PUBLIC_OCEAN_API_URL}?token=${options.token}`, {
        method: "POST",
        body: rc.toString(),
        headers: {
            "content-type": "application/json",
        },
    })

    const text = await answer.text();
    const response: Response<Res> = JSON.parse(text);

    if (response.error) {
        throw (response.error);
    }

    return response.result;
}

export async function sendQuery<Req, Res>(options: RequestOptions<Req>): Promise<Res> {
    const result = send<Req, Res>(options);

    if (result === undefined) {
        throw new Error(`Method ${options.method} expected data, but received undefined`);
    }

    return result as Res;
}

export async function sendCommand<Req>(options: RequestOptions<Req>): Promise<void> {
    send<Req, void>(options);
}

export function errorMessage(error: Error): string {
    return printMessage(error.code, error.message);
}
