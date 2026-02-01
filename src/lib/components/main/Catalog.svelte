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
    let pageQuery = $state(new URLSearchParams());

    const categories = ["Все"].concat(consts.Categories);
    const sorts = ["Манделам", "Комментариям"];
    const zeroLeadingCount = 4;

    let isLoaded = false;

    function makeBaseQuery(): URLSearchParams {
        const params = new URLSearchParams();

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

        return params;
    }

    function makeQueryAndGoto(): URLSearchParams {
        const query = new URLSearchParams(makeBaseQuery());

        for (let params of pageQuery) {
            query.append(params[0], params[1]);
        }

        const queryString = query.toString();
        let url = (queryString ? "?" : "") + queryString;

        if (!url) {
            url = "/";
        }

        goto(url);
        return query;
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
            pageNo = 1;
            console.log({ filter, category, sort });
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
