<script lang="ts">
    import * as route from "$lib/route";
    import { PageLimit } from "./local";
    import type { PageProps } from "./$types";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import NewPost from "$lib/components/forum/main/NewPost.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    let { data }: PageProps = $props();

    const topics = $derived(data.getNewResponse.topics);
    const topicCount = $derived(data.getNewResponse.topic_count);
</script>

<FramePage title="Последние сообщения форума">
    {#each topics as topic}
        <NewPost {topic} />
    {/each}
</FramePage>

<Pagination
    count={topicCount}
    limit={PageLimit}
    offset={data.pageNo}
    baseRoute={route.Forum.New}
/>
