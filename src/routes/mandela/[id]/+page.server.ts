import type { PageServerLoad } from './$types';
import { loadComments } from '$lib/comments'
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url, locals, params }) => {
    const mandelaId = +params.id;
    const pageNo = Number(url.searchParams.get("page")) || 1;

    const getOneResponse = await api.Mandela.GetOne.exec({
        id: mandelaId,
    }, locals.session.token);

    const automaticTrash = getOneResponse.mandela.automatic_trash;

    if (!locals.session.isAnonym && !getOneResponse.mandela.mark_ts) {
        await api.Mandela.Mark.exec({ id: getOneResponse.mandela.id }, locals.session.token);
    }

    const commentGetAllResponse = await loadComments(mandelaId, pageNo, locals.session.token);

    return {
        getOneResponse,
        commentGetAllResponse,
        url: url.href,
        pageNo,
        automaticTrash,
    };
}
