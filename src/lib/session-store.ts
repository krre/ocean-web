import fs from 'fs/promises';
import path from 'path';
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

            return JSON.parse(file);
        } catch {
            return anonymSession()
        }
    }

    return anonymSession()
}

export async function saveSession(sessionId: string, session: UserSession) {
    await fs.writeFile(
        filePath(sessionId),
        JSON.stringify(session)
    );
}

export async function deleteSession(sessionId: string) {
    await fs.rm(filePath(sessionId), { force: true });
}

function filePath(sessionId: string): string {
    return path.join(SESSIONS_DIR, sessionId + '.json')
}
