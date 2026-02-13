import type { PageServerLoad } from './$types';
import { PageLimit } from './local';
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url, params, locals }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;
    const sectionId = +params.id;

    const getAllResponse = await api.Forum.Topic.GetAll.exec({
        section_id: sectionId,
        offset: (pageNo - 1) * PageLimit,
        limit: PageLimit,
    }, locals.session.token);

    return {
        pageNo,
        sectionId,
        getAllResponse,
    };
}
