import type { PageServerLoad } from './$types';
import { PageLimit } from './local'
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;

    const params: api.Feed.GetAll.Request = {
        limit: PageLimit,
        offset: (pageNo - 1) * PageLimit,
    };

    const getAllResponse = await api.Feed.GetAll.exec(params);
    return { getAllResponse, pageNo };
}
