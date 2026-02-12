import { RequestCreator, type Response, type Error } from "$lib/json-rpc"
import { printMessage } from "$lib/api-error"
import { session } from "./stores";
import { PUBLIC_OCEAN_API_URL } from '$env/static/public';
import type { UserSession } from "./types";

async function send<Req, Res>(method: string, params?: Req): Promise<Res | void> {
    const rc = new RequestCreator(method, params);

    const answer = await fetch(`${PUBLIC_OCEAN_API_URL}?token=${session().token}`, {
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

export async function sendQuery<Req, Res>(method: string, params?: Req): Promise<Res> {
    const result = send<Req, Res>(method, params);

    if (result === undefined) {
        throw new Error(`Method ${method} expected data, but received undefined`);
    }

    return result as Res;
}

export async function sendCommand<Req>(method: string, params?: Req): Promise<void> {
    send<Req, void>(method, params);
}

export function errorMessage(error: Error): string {
    return printMessage(error.code, error.message);
}

export async function login(session: UserSession) {
    const response = await fetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify(session),
        headers: {
            "content-type": "application/json",
        },
    });

    const res = await response.json();

    if (!res) {
        throw new Error("Ошибка сохранения сессии");
    }
}

export async function logout() {
    await fetch("/api/user/logout", {
        method: "POST",
    });
}
