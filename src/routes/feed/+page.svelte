<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as bbcode from "$lib/bbcode";
    import * as api from "$lib/api";
    import { userUrl, dateUrl, formatDateTime } from "$lib/utils";
    import { PageLimit } from "./local";
    import type { PageProps } from "./$types";
    import Frame from "$lib/components/Frame.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    const title = "Лента новостей";

    let { data }: PageProps = $props();

    const feeds = $derived(data.getAllResponse.feeds);
    const totalCount = $derived(data.getAllResponse.total_count);
    const pageNo = $derived(data.pageNo);

    function description(type: string): string {
        if (type == api.Feed.TitleType.Mandela) return "Мандела";
        if (type == api.Feed.TitleType.Comment) return "Комментарий к манделе";
        if (type == api.Feed.TitleType.Topic) return "Тема на форуме";
        if (type == api.Feed.TitleType.Post) return "Пост на форуме";
        return "";
    }

    function titleRoute(id: number, type: string): string {
        if (
            type == api.Feed.TitleType.Mandela ||
            type == api.Feed.TitleType.Comment
        ) {
            return route.Mandela.Id(id);
        }

        if (
            type == api.Feed.TitleType.Topic ||
            type == api.Feed.TitleType.Post
        ) {
            return route.Forum.Topic.Id(id);
        }

        return "";
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
    count={totalCount}
    limit={PageLimit}
    offset={pageNo}
    baseRoute={route.Feed.Root}
/>
