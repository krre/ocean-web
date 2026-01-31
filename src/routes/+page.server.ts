import type { PageServerLoad } from './$types';
import * as api from "$lib/api";
import * as consts from "$lib/consts";
import * as route from "$lib/route";
import type { ActivityMessage } from "$lib/types";
import { makeTitle } from "$lib/utils";

export const load: PageServerLoad = async ({ url }) => {
    const pageNo = Number(url.searchParams.get("page")) || 1;
    const filter = Number(url.searchParams.get("filter"));
    const category = Number(url.searchParams.get("category"));
    const sort = Number(url.searchParams.get("sort"));
    const userId = Number(url.searchParams.get("user"));

    let params: api.Mandela.GetAll.Request = {
        sort: sort,
        limit: consts.Mandela.Catalog.PageLimit,
        offset: (pageNo - 1) * consts.Mandela.Catalog.PageLimit,
        filter: filter,
        category: category - 1,
    };

    if (userId) {
        params.user_id = userId;
    }

    console.log(params)

    const getAllResponse = await api.Mandela.GetAll.exec(params);
    const [topics, comments] = await loadActivity();

    return {
        getAllResponse,
        topics,
        comments,
        pageNo,
        filter,
        category,
        sort,
        userId,
    };
};

async function loadActivity(): Promise<
    [ActivityMessage[], ActivityMessage[]]
> {
    const params: api.Activity.GetAll.Request = {
        limit: consts.Mandela.Activity.PageLimit,
    };
    const result = await api.Activity.GetAll.exec(params);

    const topics: ActivityMessage[] = [];

    result.topics.forEach((item: api.Activity.Topic) => {
        const topic: ActivityMessage = {
            id: item.post_id,
            title: item.name,
            baseUrl: route.Forum.Topic.Id(item.id),
            pageNo: Math.ceil(
                item.post_count / consts.Forum.Post.PageLimit,
            ),
            date: item.post_create_ts,
            userName: item.user_name,
            userId: item.user_id,
            message: item.post,
        };

        topics.push(topic);
    });

    const comments: ActivityMessage[] = [];

    result.comments.forEach((item: api.Activity.Comment) => {
        const comment: ActivityMessage = {
            id: item.id,
            title: makeTitle(item),
            baseUrl: route.Mandela.Id(item.mandela_id),
            pageNo: Math.ceil(
                item.comment_count / consts.Mandela.Comment.PageLimit,
            ),
            date: item.create_ts,
            userName: item.user_name,
            userId: item.user_id,
            message: item.message,
        };

        comments.push(comment);
    });

    return [topics, comments];
}
