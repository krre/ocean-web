<script lang="ts">
    import * as route from "$lib/route";
    import { isAnonymAllowed } from "$lib/utils";
    import type { PathPart } from "$lib/forum";
    import { userSession } from "$lib/stores";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import TopicElement from "$lib/components/forum/topic/TopicElement.svelte";
    import Navigator from "$lib/components/forum/main/Navigator.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import type { PageProps } from "./$types";
    import { PageLimit } from "./local";
    import { goto, invalidateAll } from "$app/navigation";

    const { data }: PageProps = $props();

    const topics = $derived(data.getAllResponse.topics);
    const sectionName = $derived(data.getAllResponse.section_name);

    let categoryNav: PathPart = $derived({
        id: data.getAllResponse.category_id,
        name: data.getAllResponse.category_name,
    });

    function append() {
        if (!$userSession.isAnonym || isAnonymAllowed()) {
            goto(route.Forum.Topic.Append(data.sectionId));
        }
    }

    async function reload() {
        invalidateAll();
    }
</script>

<Navigator category={categoryNav} />

<FramePage title={sectionName}>
    {#snippet button()}
        <button onclick={append}>Создать тему</button>
    {/snippet}

    {#each topics as topic}
        <TopicElement {topic} onremoved={() => reload()} />
    {/each}
</FramePage>

<Pagination
    count={data.getAllResponse.topic_count}
    limit={PageLimit}
    offset={data.pageNo}
    baseRoute={route.Forum.Section.Id(data.sectionId)}
/>
