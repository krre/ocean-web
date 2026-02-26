<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { userSession } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { formatDateTime, zeroLeading, makeTitle } from "$lib/utils";
    import { Vote } from "$lib/types";
    import Indicator from "./Indicator.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import Frame from "$lib/components/Frame.svelte";

    enum Filter {
        All,
        New,
        Mine,
        Poll,
        Trash,
        Category,
    }

    interface Props {
        pageNo: number;
        filter: number;
        category: number;
        sort: number;
        userId: number;
        getAllResponse: api.Mandela.GetAll.Response;
    }

    let { pageNo, filter, category, sort, userId, getAllResponse }: Props =
        $props();

    let baseQuery = $state(new URLSearchParams());

    let mandels: api.Mandela.GetAll.Mandela[] = $derived(
        getAllResponse.mandels,
    );
    let totalCount = $derived(getAllResponse.total_count);
    let newCount = $derived(getAllResponse.new_count);
    let mineCount = $derived(getAllResponse.mine_count);
    let pollCount = $derived(getAllResponse.poll_count);
    let trashCount = $derived(getAllResponse.trash_count);
    let categoryCount = $derived(getAllResponse.category_count);
    let userCount = $derived(getAllResponse.user_count);

    let currentCount = $state(0);

    const categories = ["Все"].concat(consts.Categories);
    const sorts = ["Манделам", "Комментариям"];
    const zeroLeadingCount = 4;

    let isLoaded = false;

    function makeQueryAndGoto(): URLSearchParams {
        const baseQuery = new URLSearchParams();

        if (sort) {
            baseQuery.append("sort", sort.toString());
        }

        if (category) {
            baseQuery.append("category", category.toString());
        }

        if (filter) {
            baseQuery.append("filter", filter.toString());
        }

        if (userId) {
            baseQuery.append("user", userId.toString());
        }

        const query = new URLSearchParams(baseQuery);

        if (pageNo > 1) {
            query.append("page", pageNo.toString());
        }

        const queryString = query.toString();
        let url = (queryString ? "?" : "") + queryString;

        if (!url) {
            url = "/";
        }

        goto(url);
        isLoaded = false;
        return baseQuery;
    }

    function voteColor(votes: api.Mandela.Vote[]): string {
        let maxCount = 0;
        let maxVote = Vote.Neutral;

        for (const vote of votes) {
            if (vote.count > maxCount) {
                maxCount = vote.count;
                maxVote = vote.vote;
            }
        }

        return consts.VoteColors[maxVote];
    }

    $effect(() => {
        filter = category > 0 ? Filter.Category : Filter.All;
    });

    $effect(() => {
        if (userId) {
            currentCount = userCount;
        } else if (filter === Filter.All) {
            currentCount = totalCount;
        } else if (filter === Filter.New) {
            currentCount = newCount;
        } else if (filter === Filter.Mine) {
            currentCount = mineCount;
        } else if (filter === Filter.Poll) {
            currentCount = pollCount;
        } else if (filter === Filter.Trash) {
            currentCount = trashCount;
        } else if (filter === Filter.Category) {
            currentCount = categoryCount;
        }
    });

    $effect(() => {
        if (
            filter >= 0 &&
            category >= 0 &&
            sort >= 0 &&
            userId >= 0 &&
            isLoaded
        ) {
            baseQuery = makeQueryAndGoto();
        } else {
            isLoaded = true;
        }
    });
</script>

<style>
    .comments {
        color: red;
        display: inline;
        background-color: rgb(255, 247, 230);
        padding: 0 0.4em;
    }

    .new-mandela {
        color: red;
    }

    .row {
        display: block;
        margin: 0.3em 0;
    }

    .tool-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5em;
        margin-bottom: 0.7em;
    }
</style>

<Frame title="Океан. Каталог фактов эффекта Манделы" showHeader={false}>
    <div class="tool-bar">
        {#if !userId}
            <Indicator
                title="Всего"
                count={totalCount}
                active={filter == Filter.All}
                onclick={() => (filter = Filter.All)}
            />
            {#if !$userSession.isAnonym}
                <Indicator
                    title="Новые"
                    count={newCount}
                    active={filter == Filter.New}
                    highlightNew={true}
                    onclick={() => (filter = Filter.New)}
                />

                <Indicator
                    title="Мои"
                    count={mineCount}
                    active={filter == Filter.Mine}
                    onclick={() => (filter = Filter.Mine)}
                />

                <Indicator
                    title="Опросы"
                    count={pollCount}
                    highlightNew={true}
                    active={filter == Filter.Poll}
                    onclick={() => (filter = Filter.Poll)}
                />
            {/if}

            <Indicator
                title="Хлам"
                count={trashCount}
                active={filter == Filter.Trash}
                onclick={() => (filter = Filter.Trash)}
            />
        {/if}

        <span
            >Категория:
            <select bind:value={category}>
                {#each categories as categoryName, i}
                    <option value={i} selected={category == i}>
                        {categoryName}
                    </option>
                {/each}
            </select>
        </span>
        <span
            >Сортировать по:
            <select bind:value={sort}>
                {#each sorts as sortName, i}
                    <option value={i} selected={sort == i}>{sortName}</option>
                {/each}
            </select>
        </span>
    </div>

    {#each mandels as mandela}
        <div class="row" style="background-color: {voteColor(mandela.votes)}">
            <a class="row-link" href={route.Mandela.Id(mandela.id)}>
                <span
                    class:new-mandela={!$userSession.isAnonym &&
                        !mandela.mark_ts}
                    >{zeroLeading(mandela.id, zeroLeadingCount)}</span
                >
                ·
                {formatDateTime(mandela.create_ts)}
                ·
                {makeTitle(mandela)}
                ·
                {mandela.user_name}
                {#if mandela.comment_count}
                    · Комментариев:
                    <div class="comments">{mandela.comment_count}</div>
                {/if}
            </a>
        </div>
    {/each}
</Frame>

<Pagination
    count={currentCount}
    limit={consts.Mandela.Catalog.PageLimit}
    offset={pageNo}
    {baseQuery}
/>
