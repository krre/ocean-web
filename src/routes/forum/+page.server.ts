import type { PageServerLoad } from './$types';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url }) => {
    const getAllResponse = await api.Forum.GetAll.exec();

    return {
        getAllResponse,
    };
}
