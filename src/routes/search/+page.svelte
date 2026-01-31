<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = 30;

    enum Type {
        Mandela,
        Comment,
        ForumPost,
    }

    async function load(
        text: string,
        type: Type,
        page: number,
    ): Promise<api.Search.GetAll.Response> {
        const params: api.Search.GetAll.Request = {
            text,
            type: type,
            limit: PAGE_LIMIT,
            offset: (page - 1) * PAGE_LIMIT,
        };

        return api.Search.GetAll.exec(params);
    }

    export async function preload(page: Page, _session: Session) {
        const pageNo = +page.query.page || 1;
        const type = +page.query.type || Type.Mandela;
        const text = page.query.text || "";

        let searchGetAllResponse = await load(text, type, pageNo);

        return {
            searchGetAllResponse,
            text,
            type,
            pageNo,
        };
    }
</script>

<script lang="ts">
    import { run } from "svelte/legacy";

    import * as route from "$lib/route";
    import * as consts from "$lib/consts";
    import { pageUrl } from "$lib/utils";
    import { goto } from "$app/navigation";
    import Frame from "$lib/components/Frame.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import WaitButton from "$lib/components/WaitButton.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    interface Props {
        searchGetAllResponse: api.Search.GetAll.Response;
        type?: any;
        text?: string;
        pageNo?: number;
    }

    let {
        searchGetAllResponse = $bindable(),
        type = $bindable(Type.Mandela),
        text = $bindable(""),
        pageNo = $bindable(1),
    }: Props = $props();

    let baseQuery = $state(new URLSearchParams());
    let records: api.Search.GetAll.Record[] = $state([]);
    let start = $state(true);
    let buttonEnabled = $state(true);
    let totalCount = $state(0);

    run(() => {
        if (searchGetAllResponse) {
            records = searchGetAllResponse.records;
            totalCount = searchGetAllResponse.total_count;
        }
    });

    function clear() {
        start = true;
        records = [];
    }

    async function search() {
        clear();
        buttonEnabled = false;
        pageNo = 1;
        totalCount = 0;

        try {
            searchGetAllResponse = await load(text, type, pageNo);
            start = false;

            const params = new URLSearchParams();

            if (type) {
                params.append("type", type.toString());
            }

            if (text.length) {
                params.append("text", text);
            }

            baseQuery = params;
            const query = baseQuery.toString();
            goto(route.Search + (query ? "?" + query : ""));
        } catch (e) {
            console.error(e);
        }

        buttonEnabled = true;
    }

    function keyPressed(event: any) {
        if (event.key == "Enter") {
            search();
        }
    }

    function recordTitle(
        titleId: number,
        title: string,
        id: number,
        row: number,
    ) {
        if (type == Type.Mandela) {
            return `<a target="_blank" href="${route.Mandela.Id(
                titleId,
            )}">${title}</a>`;
        } else if (type == Type.Comment) {
            const page = Math.ceil(row / consts.Mandela.Comment.PageLimit);
            return pageUrl(route.Mandela.Id(titleId), title, id, page, true);
        } else {
            const page = Math.ceil(row / consts.Forum.Post.PageLimit);
            return pageUrl(
                route.Forum.Topic.Id(titleId),
                title,
                id,
                page,
                true,
            );
        }
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        max-width: 30em;
        gap: 0.7em;
    }

    .record {
        border-bottom: var(--border-1px);
        padding: var(--page-padding);
    }

    .record:last-child {
        border-bottom: none;
    }

    .content {
        margin-top: 1em;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>

<Frame title="Поиск">
    <div class="container">
        Искать по:
        <div>
            <select bind:value={type}>
                <option value={Type.Mandela}>манделам</option>
                <option value={Type.Comment}>комментариям</option>
                <option value={Type.ForumPost}>форуму</option>
            </select>
        </div>

        Введите текст:
        <input bind:value={text} onkeyup={keyPressed} />
        <div>
            <WaitButton
                title="Найти"
                enabled={buttonEnabled}
                sendAction={search}
            />
        </div>
    </div>
</Frame>

{#if records.length}
    <Rectangle padding={false}>
        {#each records as record}
            <div class="record">
                {@html recordTitle(
                    record.title_id,
                    record.title,
                    record.id,
                    record.row,
                )}

                <div class="content">
                    {@html record.content}
                </div>
            </div>
        {/each}
    </Rectangle>
{/if}

{#if !start && records.length == 0}
    <Rectangle>Ничего не найдено</Rectangle>
{/if}

<Pagination
    count={totalCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Search}
    {baseQuery}
/>
