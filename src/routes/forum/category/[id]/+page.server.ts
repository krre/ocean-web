import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params, locals }) => {
    const categoryId = +params.id;

    const getAllResponse = await api.Forum.Section.GetAll.exec({
        category_id: categoryId,
    }, locals.session.token);

    return {
        categoryId,
        getAllResponse,
    };
}
