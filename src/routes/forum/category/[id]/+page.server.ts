import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params }) => {
    const categoryId = +params.id;

    const getAllResponse = await api.Forum.Section.GetAll.exec({
        category_id: categoryId,
    });

    return {
        categoryId,
        getAllResponse,
    };
}
