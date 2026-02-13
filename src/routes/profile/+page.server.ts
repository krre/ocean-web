import * as api from "$lib/api";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const params: api.User.GetOne.Request = {
        id: locals.session.id,
    };

    const user = await api.User.GetOne.exec(params, locals.session.token);
    return { user };
}
