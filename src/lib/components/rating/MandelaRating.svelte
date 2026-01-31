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
        mandels = []
    }: Props = $props();

    function mandelaLink(
        id: number,
        mandela: api.Rating.GetMandels.Mandela,
        i: number,
    ) {
        const title = makeTitle(mandela);
        return `<a class="row-link" href=${route.Mandela.Id(id)}>${
            i + 1 + (pageNo - 1) * pageLimit
        }. ${title} - ${mandela.count}</a>`;
    }
</script>

<select bind:value={vote}>
    {#each consts.Votes as voteName, i}
        <option value={i} selected={vote == i}>{voteName}</option>
    {/each}
</select>

<p></p>

{#each mandels as mandela, i}
    {@html mandelaLink(mandela.id, mandela, i)}
    <br />
{/each}
