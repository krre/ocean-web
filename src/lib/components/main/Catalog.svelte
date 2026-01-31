<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { userSession } from "$lib/stores";
    import { onMount } from "svelte";
    import { Mounted, Vote } from "$lib/types";
    import { goto } from "$app/navigation";
    import { formatDateTime, zeroLeading, makeTitle } from "$lib/utils";
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
        pageLimit?: number;
        pageNo?: number;
        filter?: any;
        category?: number;
        sort?: number;
        userId?: number;
        getAllResponse: api.Mandela.GetAll.Response;
    }

    let {
        pageLimit = 1,
        pageNo = $bindable(1),
        filter = $bindable(Filter.All),
        category = $bindable(0),
        sort = $bindable(0),
        userId = 0,
        getAllResponse,
    }: Props = $props();

    let mounted = new Mounted();

    onMount(() => {
        mounted.setDone();
    });

    let baseQuery = $state(new URLSearchParams());

    let mandels: api.Mandela.GetAll.Mandela[] = $state([]);
    let categories = ["Все"].concat(consts.Categories);
    let totalCount = $state(0);
    let newCount = $state(0);
    let mineCount = $state(0);
    let pollCount = $state(0);
    let trashCount = $state(0);
    let categoryCount = $state(0);
    let userCount = $state(0);

    let currentCount = $state(0);
    let pageQuery = $state(new URLSearchParams());

    const sorts = ["Манделам", "Комментариям"];
    const zeroLeadingCount = 4;

    function makeBaseQuery() {
        const params = new URLSearchParams();

        if (filter != Filter.Category && category > 0) {
            category = 0;
        }

        if (sort) {
            params.append("sort", sort.toString());
        }

        if (category) {
            params.append("category", category.toString());
        }

        if (filter) {
            params.append("filter", filter.toString());
        }

        if (userId) {
            params.append("user", userId.toString());
        }

        baseQuery = params;
    }

    function makeQueryAndGoto(usePage: boolean = true) {
        makeBaseQuery();

        const gotoQuery = new URLSearchParams(baseQuery);

        if (usePage) {
            for (let params of pageQuery) {
                gotoQuery.append(params[0], params[1]);
            }
        }

        const queryString = gotoQuery.toString();
        goto((queryString ? "?" : "") + queryString);
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
        if (mounted.done()) {
            filter = category > 0 ? Filter.Category : Filter.All;
        }
    });

    $effect(() => {
        mandels = getAllResponse.mandels;
        totalCount = getAllResponse.total_count;
        newCount = getAllResponse.new_count;
        mineCount = getAllResponse.mine_count;
        pollCount = getAllResponse.poll_count;
        trashCount = getAllResponse.trash_count;
        categoryCount = getAllResponse.category_count;
        userCount = getAllResponse.user_count;

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
        if (mounted.done() && filter >= 0 && category >= 0) {
            pageNo = 1;
            makeQueryAndGoto(false);
        }
    });

    $effect(() => {
        if (mounted.done() && sort >= 0) {
            makeQueryAndGoto();
        }
    });

    $effect(() => {
        if (userId) {
            makeBaseQuery();
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
                on:clicked={() => (filter = Filter.All)}
            />
            {#if !$userSession.isAnonym}
                <Indicator
                    title="Новые"
                    count={newCount}
                    active={filter == Filter.New}
                    highlightNew={true}
                    on:clicked={() => (filter = Filter.New)}
                />

                <Indicator
                    title="Мои"
                    count={mineCount}
                    active={filter == Filter.Mine}
                    on:clicked={() => (filter = Filter.Mine)}
                />

                <Indicator
                    title="Опросы"
                    count={pollCount}
                    highlightNew={true}
                    active={filter == Filter.Poll}
                    on:clicked={() => (filter = Filter.Poll)}
                />
            {/if}

            <Indicator
                title="Хлам"
                count={trashCount}
                active={filter == Filter.Trash}
                on:clicked={() => (filter = Filter.Trash)}
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
    limit={pageLimit}
    offset={pageNo}
    {baseQuery}
    bind:pageQuery
/>
