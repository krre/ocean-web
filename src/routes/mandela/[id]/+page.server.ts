import type { PageServerLoad } from './$types';
import * as api from "$lib/api";
import * as consts from "$lib/consts";

export const load: PageServerLoad = async ({ url, locals, params }) => {
    const mandelaId = +params.id;
    const pageNo = Number(url.searchParams.get("page")) || 1;

    const getOneResponse = await api.Mandela.GetOne.exec({
        id: mandelaId,
    });

    const automaticTrash = getOneResponse.mandela.automatic_trash;

    if (!locals.session.isAnonym && !getOneResponse.mandela.mark_ts) {
        await api.Mandela.Mark.exec({ id: getOneResponse.mandela.id });
    }

    const commentGetAllResponse = await loadComments(mandelaId, pageNo);

    return {
        getOneResponse,
        commentGetAllResponse,
        url: url.href,
        pageNo,
        automaticTrash,
    };
}

function loadComments(
    mandelaId: number,
    pageNo: number,
): Promise<api.Comment.GetAll.Response> {
    const params: api.Comment.GetAll.Request = {
        mandela_id: mandelaId,
        limit: consts.Mandela.Comment.PageLimit,
        offset: (pageNo - 1) * consts.Mandela.Comment.PageLimit,
    };

    return api.Comment.GetAll.exec(params);
}
