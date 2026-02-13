import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ locals }) => {
    const getAllResponse = await api.Forum.GetAll.exec(locals.session.token);

    return {
        getAllResponse,
    };
}
