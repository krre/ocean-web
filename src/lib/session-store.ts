import fs from 'fs/promises';
import path from 'path';
import * as consts from '$lib/consts'
import type { UserSession } from './types';
import { anonymSession } from './stores';

const SESSIONS_DIR = '.sessions';

await fs.mkdir(SESSIONS_DIR, { recursive: true });

export async function loadSession(sessionId?: string): Promise<UserSession> {
    if (sessionId) {
        try {
            const file = await fs.readFile(
                filePath(sessionId),
                'utf-8'
            );

            const session: UserSession = JSON.parse(file);
            session.isAnonym = false;
            session.isAdmin = session.code == consts.Account.Admin;

            return session;
        } catch {
            return anonymSession()
        }
    }

    return anonymSession()
}

export async function saveSession(sessionId: string, session: UserSession) {
    const obj = {
        id: session.id,
        code: session.code,
        name: session.name,
        token: session.token
    }

    await fs.writeFile(
        filePath(sessionId),
        JSON.stringify(obj)
    );
}

export async function deleteSession(sessionId: string) {
    await fs.rm(filePath(sessionId), { force: true });
}

function filePath(sessionId: string): string {
    return path.join(SESSIONS_DIR, sessionId + '.json')
}
