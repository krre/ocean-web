import { setSession } from '$lib/session-store';
// import { randomUUID } from 'crypto';

export const actions = {
    login: async ({ request, cookies, locals }) => {
        console.log(request, cookies, locals)
        // const form = await request.formData();
        // const user = await authenticate(form);

        // const sessionId = randomUUID();

        // await setSession(sessionId, { user });

        // cookies.set('session_id', sessionId, {
        //     path: '/',
        //     httpOnly: true,
        //     sameSite: 'lax',
        //     secure: true,
        //     maxAge: 60 * 60 * 24 * 365
        // });

        // locals.session = { user };

        return { success: true };
    }
};
