<script lang="ts">
    import * as route from "$lib/route";
    import * as consts from "$lib/consts";
    import { SearchType, PageLimit } from "./local";
    import type { PageProps } from "./$types";
    import { pageUrl } from "$lib/utils";
    import { goto } from "$app/navigation";
    import { untrack } from "svelte";
    import Frame from "$lib/components/Frame.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import WaitButton from "$lib/components/WaitButton.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    let { data }: PageProps = $props();

    let records = $derived(data.searchGetAllResponse.records);
    let totalCount = $derived(data.searchGetAllResponse.total_count);

    let baseQuery = $state(new URLSearchParams());
    let pageNo = $state(0);

    let searchType = $state(SearchType.Mandela);
    let searchText = $state("");

    let isLoaded = $state(false);

    $effect(() => {
        if (
            data.type >= 0 &&
            data.text.length >= 0 &&
            data.pageNo >= 1 &&
            untrack(() => isLoaded)
        ) {
            searchType = data.type;
            searchText = data.text;
            pageNo = data.pageNo;
        }

        isLoaded = true;
    });

    async function search() {
        pageNo = 1;

        try {
            const params = new URLSearchParams();

            if (searchType) {
                params.append("type", searchType.toString());
            }

            if (searchText.length) {
                params.append("text", searchText);
            }

            baseQuery = params;
            const query = baseQuery.toString();
            goto(route.Search + (query ? "?" + query : ""));
            isLoaded = false;
        } catch (e) {
            console.error(e);
        }
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
        if (searchType == SearchType.Mandela) {
            return `<a target="_blank" href="${route.Mandela.Id(
                titleId,
            )}">${title}</a>`;
        } else if (searchType == SearchType.Comment) {
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
            <select bind:value={searchType}>
                <option value={SearchType.Mandela}>манделам</option>
                <option value={SearchType.Comment}>комментариям</option>
                <option value={SearchType.ForumPost}>форуму</option>
            </select>
        </div>

        Введите текст:
        <input bind:value={searchText} onkeyup={keyPressed} />
        <div>
            <WaitButton
                title="Найти"
                enabled={isLoaded && searchText.length > 0}
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

{#if isLoaded && records.length == 0}
    <Rectangle>Ничего не найдено</Rectangle>
{/if}

<Pagination
    count={totalCount}
    limit={PageLimit}
    offset={pageNo}
    baseRoute={route.Search}
    {baseQuery}
/>
