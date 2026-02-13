import * as api from "$lib/api";
import * as consts from "$lib/consts";

export async function loadComments(
    mandelaId: number,
    pageNo: number,
    token: string
): Promise<api.Comment.GetAll.Response> {
    const params: api.Comment.GetAll.Request = {
        mandela_id: mandelaId,
        limit: consts.Mandela.Comment.PageLimit,
        offset: (pageNo - 1) * consts.Mandela.Comment.PageLimit,
    };

    return await api.Comment.GetAll.exec(params, token);
}
