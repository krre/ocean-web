<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = 20;

    export async function preload(page: Page, _session: Session) {
        const sectionId = +page.params.id;
        const pageNo = +page.query.page || 1;
        const getAllResponse = await load(sectionId, pageNo);
        return { getAllResponse, pageNo, sectionId };
    }

    async function load(
        sectionId: number,
        pageNo: number,
    ): Promise<api.Forum.Topic.GetAll.Response> {
        const params: api.Forum.Topic.GetAll.Request = {
            section_id: sectionId,
            offset: (pageNo - 1) * PAGE_LIMIT,
            limit: PAGE_LIMIT,
        };

        return api.Forum.Topic.GetAll.exec(params);
    }
</script>

<script lang="ts">
    import { run } from "svelte/legacy";

    import * as route from "$lib/route";
    import type { User } from "$lib/types";
    import { isAnonymAllowed } from "$lib/utils";
    import { goto } from "$app/navigation";
    import type { PathPart } from "$lib/forum";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";
    import TopicElement from "$lib/components/forum/topic/TopicElement.svelte";
    import Navigator from "$lib/components/forum/main/Navigator.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    interface Props {
        getAllResponse: api.Forum.Topic.GetAll.Response;
        sectionId?: number;
        pageNo?: number;
    }

    let {
        getAllResponse = $bindable(),
        sectionId = 0,
        pageNo = 1,
    }: Props = $props();

    let topics: api.Forum.Topic.GetAll.Topic[] = $state();
    let topicCount = $state(0);
    let sectionName: string = $state();
    let categoryNav: PathPart = $state();

    let isAdmin = $state(false);
    let user: User = $state();

    run(() => {
        sectionName = getAllResponse.section_name;
        topics = getAllResponse.topics;
        topicCount = getAllResponse.topic_count;

        categoryNav = {
            id: getAllResponse.category_id,
            name: getAllResponse.category_name,
        };
    });

    function append() {
        if (user || isAnonymAllowed()) {
            goto(route.Forum.Topic.Append(sectionId));
        }
    }

    async function reload() {
        getAllResponse = await load(sectionId, pageNo);
    }
</script>

<style>
</style>

<SessionHub bind:user bind:isAdmin />
<Navigator category={categoryNav} />

<FramePage title={sectionName}>
    {#snippet button()}
        <button onclick={append}>Создать тему</button>
    {/snippet}

    {#each topics as topic}
        <TopicElement {topic} on:removed={() => reload()} />
    {/each}
</FramePage>

<Pagination
    count={topicCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Forum.Section.Id(sectionId)}
/>
