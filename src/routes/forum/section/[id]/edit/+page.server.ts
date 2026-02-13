import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params, locals }) => {
    const id = +params.id;
    const getOneResponse = await api.Forum.Section.GetOne.exec({ id }, locals.session.token);

    return {
        id,
        getOneResponse,
    };
}
