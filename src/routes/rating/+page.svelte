<script lang="ts">
    import * as route from "$lib/route";
    import * as types from "$lib/types";
    import * as local from "./local";
    import { goto } from "$app/navigation";
    import { MandelaVote } from "$lib/types";
    import type { PageProps } from "./$types";
    import Frame from "$lib/components/Frame.svelte";
    import MandelaRating from "$lib/components/rating/MandelaRating.svelte";
    import UserRating from "$lib/components/rating/UserRating.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    let { data }: PageProps = $props();

    let vote = $state(MandelaVote.Yes);
    let type = $state(types.RatingType.Mandels);

    let baseQuery = $state(new URLSearchParams());

    let mandels = $derived(
        data.getMandelsResponse ? data.getMandelsResponse.mandels : [],
    );

    let mandelsCount = $derived(
        data.getMandelsResponse ? data.getMandelsResponse.total_count : 0,
    );

    let users = $derived(
        data.getUsersResponse ? data.getUsersResponse.users : [],
    );

    let usersCount = $derived(
        data.getUsersResponse ? data.getUsersResponse.user_count : 0,
    );

    let isLoaded = false;

    $effect(() => {
        vote = data.vote;
    });

    $effect(() => {
        type = data.type;
    });

    $effect(() => {
        if (isLoaded) {
            const params = new URLSearchParams();
            if (type == types.RatingType.Users) {
                params.append("type", type.toString());
            } else if (vote > MandelaVote.Yes) {
                params.append("vote", vote.toString());
            }
            baseQuery = params;
            const query = baseQuery.toString();
            goto(route.Rating + (query ? "?" + query : ""));
            isLoaded = false;
        } else {
            isLoaded = true;
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
        <MandelaRating
            bind:vote
            {mandels}
            pageNo={data.pageNo}
            pageLimit={local.PageLimit}
        />
    {:else}
        <UserRating {users} pageNo={data.pageNo} pageLimit={local.PageLimit} />
    {/if}
</Frame>

<Pagination
    count={type === types.RatingType.Mandels ? mandelsCount : usersCount}
    limit={local.PageLimit}
    offset={data.pageNo}
    baseRoute={route.Rating}
    {baseQuery}
/>
