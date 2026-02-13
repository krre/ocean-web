import type { PageServerLoad } from './$types';
import { SearchType, PageLimit } from './local'
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url, locals }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;
    const type = Number(url.searchParams.get("type")) || SearchType.Mandela;
    const text = url.searchParams.get("text") || "";

    const params: api.Search.GetAll.Request = {
        text,
        type: type,
        limit: PageLimit,
        offset: (pageNo - 1) * PageLimit,
    };

    const searchGetAllResponse = await api.Search.GetAll.exec(params, locals.session.token);

    return {
        searchGetAllResponse,
        text,
        type,
        pageNo,
    };
}
