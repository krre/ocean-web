<script lang="ts">
    import type { PageProps } from "./$types";
    import Catalog from "$lib/components/main/Catalog.svelte";
    import Activity from "$lib/components/main/activity/Activity.svelte";

    let { data }: PageProps = $props();
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
            pageNo={data.pageNo}
            filter={data.filter}
            category={data.category}
            sort={data.sort}
            userId={data.userId}
            getAllResponse={data.getAllResponse}
        />
    </div>

    <Activity topics={data.topics} comments={data.comments} />
</div>
