<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = 20;

    export async function preload(page: Page, _session: Session) {
        const pageNo = +page.query.page || 1;

        const params: api.Forum.GetNew.Request = {
            offset: (pageNo - 1) * PAGE_LIMIT,
            limit: PAGE_LIMIT,
        };

        const getNewResponse = await api.Forum.GetNew.exec(params);

        return {
            getNewResponse,
            pageNo,
        };
    }
</script>

<script lang="ts">
    import * as route from "$lib/route";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import NewPost from "$lib/components/forum/main/NewPost.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    interface Props {
        pageNo?: number;
        getNewResponse: api.Forum.GetNew.Response;
    }

    let { pageNo = 1, getNewResponse }: Props = $props();

    let topics = $derived(getNewResponse.topics);
    let topicCount = $derived(getNewResponse.topic_count);
</script>

<style>
</style>

<FramePage title="Последние сообщения форума">
    {#each topics as topic}
        <NewPost {topic} />
    {/each}
</FramePage>

<Pagination
    count={topicCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Forum.New}
/>
