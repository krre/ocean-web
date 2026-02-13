import type { PageServerLoad } from './$types';
import * as api from "$lib/api";
import * as consts from "$lib/consts";

export const load: PageServerLoad = async ({ url, params, locals }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;
    const topicId = +params.id;
    const pageLimit = consts.Forum.Post.PageLimit;

    const getAllResponse = await api.Forum.Post.GetAll.exec({
        topic_id: topicId,
        offset: (pageNo - 1) * pageLimit,
        limit: pageLimit,
    }, locals.session.token);

    return {
        pageNo,
        topicId,
        getAllResponse,
    };
}
