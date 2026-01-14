<script module lang="ts">
    import * as consts from "$lib/consts";
</script>

<script lang="ts">
    import type { PageProps } from "./$types";
    import Catalog from "../components/main/Catalog.svelte";
    import Activity from "../components/main/activity/Activity.svelte";

    let { data }: PageProps = $props();
    const pageNo = data.pageNo;
    const filter = data.filter;
    const category = data.category;
    const sort = data.sort;
    const userId = data.userId;
    const getAllResponse = data.getAllResponse;
    const topics = data.topics;
    const comments = data.comments;
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
    }

    @media screen and (min-width: 75em) {
        .container {
            flex-direction: row;
        }

        .catalog {
            margin-right: -1em;
        }
    }

    .catalog {
        flex-grow: 1;
        margin-bottom: -1em;
    }
</style>

<div class="container">
    <div class="catalog">
        <Catalog
            {pageNo}
            {filter}
            {category}
            {sort}
            {userId}
            {getAllResponse}
            pageLimit={consts.Mandela.Catalog.PageLimit}
        />
    </div>

    <Activity {topics} {comments} />
</div>
