<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import type { MandelaVote } from "$lib/types";
    import { makeTitle } from "$lib/utils";

    interface Props {
        pageNo?: number;
        pageLimit?: number;
        vote: MandelaVote;
        mandels?: api.Rating.GetMandels.Mandela[];
    }

    let {
        pageNo = 1,
        pageLimit = 1,
        vote = $bindable(),
        mandels = [],
    }: Props = $props();
</script>

<select bind:value={vote}>
    {#each consts.Votes as voteName, i}
        <option value={i} selected={vote == i}>{voteName}</option>
    {/each}
</select>

<p></p>

{#each mandels as mandela, i}
    <a
        class="row-link"
        href={route.Mandela.Id(mandela.id)}
        data-sveltekit-preload-data="off"
        >{i + 1 + (pageNo - 1) * pageLimit}. {makeTitle(mandela)} - {mandela.count}
    </a>
    <br />
{/each}
