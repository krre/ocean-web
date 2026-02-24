import type { PageServerLoad } from './$types';
import { PageLimit } from './local';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;

    const params: api.Forum.GetNew.Request = {
        offset: (pageNo - 1) * PageLimit,
        limit: PageLimit,
    };

    const getNewResponse = await api.Forum.GetNew.exec(params);

    return {
        getNewResponse,
        pageNo,
    };
}
