import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ params }) => {
    const id = +params.id;
    const getOneResponse = await api.Forum.Category.GetOne.exec({ id });

    return {
        id,
        getOneResponse,
    };
}
