<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = 50;

    export async function preload(page: Page, _session: Session) {
        const pageNo = +page.query.page || 1;
        const vote = +page.query.vote || MandelaVote.Yes;
        const type: types.RatingType =
            +page.query.type || types.RatingType.Mandels;

        let params = {
            limit: PAGE_LIMIT,
            offset: (pageNo - 1) * PAGE_LIMIT,
        };

        let getMandelsResponse: api.Rating.GetMandels.Response;
        let getUsersResponse: api.Rating.GetUsers.Response;

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
</script>

<script lang="ts">
    import * as route from "$lib/route";
    import * as types from "$lib/types";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { Mounted, MandelaVote } from "$lib/types";
    import Frame from "$lib/components/Frame.svelte";
    import MandelaRating from "$lib/components/rating/MandelaRating.svelte";
    import UserRating from "$lib/components/rating/UserRating.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    interface Props {
        type?: any;
        vote?: any;
        getMandelsResponse: api.Rating.GetMandels.Response;
        getUsersResponse: api.Rating.GetUsers.Response;
        pageNo?: number;
    }

    let {
        type = $bindable(types.RatingType.Mandels),
        vote = $bindable(MandelaVote.Yes),
        getMandelsResponse,
        getUsersResponse,
        pageNo = 1,
    }: Props = $props();

    let mounted = new Mounted();

    onMount(() => {
        mounted.setDone();
    });

    let baseQuery = $state(new URLSearchParams());

    let mandels: api.Rating.GetMandels.Mandela[] = $state([]);
    let mandelsCount = $state(0);

    let users: api.Rating.GetUsers.User[] = $state([]);
    let usersCount = $state(0);

    $effect(() => {
        if (getUsersResponse) {
            users = getUsersResponse.users;
            usersCount = getUsersResponse.user_count;
        }
    });

    $effect(() => {
        if (getMandelsResponse) {
            mandels = getMandelsResponse.mandels;
            mandelsCount = getMandelsResponse.total_count;
        }
    });

    $effect(() => {
        if (mounted.done()) {
            const params = new URLSearchParams();

            if (type == types.RatingType.Users) {
                params.append("type", type.toString());
            } else if (vote > MandelaVote.Yes) {
                params.append("vote", vote.toString());
            }

            baseQuery = params;

            const query = baseQuery.toString();
            goto(route.Rating + (query ? "?" + query : ""));
        }
    });
</script>

<Frame title="Рейтинг">
    <label>
        <input
            type="radio"
            bind:group={type}
            value={types.RatingType.Mandels}
        />
        Манделы
    </label>

    <label>
        <input type="radio" bind:group={type} value={types.RatingType.Users} />
        Пользователи
    </label>

    <p></p>

    {#if type === types.RatingType.Mandels}
        <MandelaRating bind:vote {mandels} {pageNo} pageLimit={PAGE_LIMIT} />
    {:else}
        <UserRating {users} {pageNo} pageLimit={PAGE_LIMIT} />
    {/if}
</Frame>

<Pagination
    count={type === types.RatingType.Mandels ? mandelsCount : usersCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Rating}
    {baseQuery}
/>
