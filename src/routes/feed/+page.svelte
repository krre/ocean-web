<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = 20;

    export async function preload(page: Page, _session: Session) {
        const pageNo = +page.query.page || 1;

        const params: api.Feed.GetAll.Request = {
            limit: PAGE_LIMIT,
            offset: (pageNo - 1) * PAGE_LIMIT,
        };
        const getAllResponse = await api.Feed.GetAll.exec(params);
        return { getAllResponse, pageNo };
    }
</script>

<script lang="ts">
    import { run } from "svelte/legacy";

    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as bbcode from "$lib/bbcode";
    import { userUrl, dateUrl, formatDateTime } from "$lib/utils";
    import Frame from "$lib/components/Frame.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    interface Props {
        getAllResponse: api.Feed.GetAll.Response;
        pageNo?: number;
    }

    let { getAllResponse, pageNo = 1 }: Props = $props();

    const title = "Лента новостей";

    let feeds: api.Feed.Feed[] = $state([]);
    let total_count = $state(0);

    run(() => {
        if (getAllResponse) {
            feeds = getAllResponse.feeds;
            total_count = getAllResponse.total_count;
        }
    });

    function description(type: string): string {
        if (type == api.Feed.TitleType.Mandela) return "Мандела";
        if (type == api.Feed.TitleType.Comment) return "Комментарий к манделе";
        if (type == api.Feed.TitleType.Topic) return "Тема на форуме";
        if (type == api.Feed.TitleType.Post) return "Пост на форуме";
    }

    function titleRoute(id: number, type: string): string {
        if (
            type == api.Feed.TitleType.Mandela ||
            type == api.Feed.TitleType.Comment
        )
            return route.Mandela.Id(id);
        if (type == api.Feed.TitleType.Topic || type == api.Feed.TitleType.Post)
            return route.Forum.Topic.Id(id);
    }

    function dateRoute(
        type: api.Feed.TitleType,
        titleId: number,
        feedId: number,
        date: Date,
        row: number,
    ) {
        if (
            type == api.Feed.TitleType.Mandela ||
            type == api.Feed.TitleType.Topic
        ) {
            return formatDateTime(date);
        } else {
            const pageLimit =
                type === api.Feed.TitleType.Comment
                    ? consts.Mandela.Comment.PageLimit
                    : consts.Forum.Post.PageLimit;

            const page = Math.ceil(row / pageLimit);
            return dateUrl(titleRoute(titleId, type), date, feedId, page);
        }
    }
</script>

<style>
    .message {
        white-space: pre-line;
        overflow-wrap: break-word;
        word-wrap: break-word;
        margin-top: 1em;
    }

    h3 {
        margin: 0.5em 0.5em 0.3em 0;
    }
</style>

<Frame title="Лента новостей" showContent={false} />

{#each feeds as feed}
    <Rectangle>
        <div>
            {description(feed.type)}
        </div>
        <h3>
            <a href={titleRoute(feed.title_id, feed.type)}> {feed.title}</a>
        </h3>

        <div class="info">
            {@html userUrl(feed.user_name, feed.user_id)} · {@html dateRoute(
                feed.type,
                feed.title_id,
                feed.id,
                feed.create_ts,
                feed.row,
            )}

            <div class="message">
                {@html bbcode.parse(feed.message)}
            </div>
        </div>
    </Rectangle>
{/each}

<Pagination
    count={total_count}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Feed.Root}
/>
