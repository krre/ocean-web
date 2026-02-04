import type { PageServerLoad } from './$types';
import { MandelaVote } from "$lib/types";
import * as local from './local'
import * as types from "$lib/types";
import * as api from "$lib/api";

export const load: PageServerLoad = async ({ url }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;
    const vote = Number(url.searchParams.get("vote")) || MandelaVote.Yes;
    const type: types.RatingType =
        Number(url.searchParams.get("type")) || types.RatingType.Mandels;

    let params = {
        limit: local.PageLimit,
        offset: (pageNo - 1) * local.PageLimit,
    };

    let getMandelsResponse: api.Rating.GetMandels.Response | undefined;
    let getUsersResponse: api.Rating.GetUsers.Response | undefined;

    if (type === types.RatingType.Mandels) {
        const par = params as api.Rating.GetMandels.Request;
        par.vote = vote;
        getMandelsResponse = await api.Rating.GetMandels.exec(par);
    } else {
        getUsersResponse = await api.Rating.GetUsers.exec(params);
    }

    return {
        getMandelsResponse,
        getUsersResponse,
        type,
        vote,
        pageNo,
    };
}
