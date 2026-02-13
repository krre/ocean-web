import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params, locals }) => {
    const user = await api.User.GetOne.exec({ id: +params.id }, locals.session.token);
    return { user };
}
