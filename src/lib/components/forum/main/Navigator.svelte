<script lang="ts">
    import { run } from 'svelte/legacy';

    import type { PathPart } from "$lib/forum";
    import * as route from "$lib/route";

    interface Props {
        category?: PathPart;
        section?: PathPart;
        topic?: PathPart;
    }

    let { category = $bindable(null), section = $bindable(null), topic = $bindable(null) }: Props = $props();

    let path: PathPart[] = $state();

    run(() => {
        path = [];
        path.push({ name: "Форум", route: route.Forum.Root });

        if (category) {
            category.route = route.Forum.Category.Id(category.id);
            path.push(category);
        }

        if (section) {
            section.route = route.Forum.Section.Id(section.id);
            path.push(section);
        }

        if (topic) {
            topic.route = route.Forum.Topic.Id(topic.id);
            path.push(topic);
        }
    });
</script>

<style>
    .path {
        margin: var(--page-margin);
        display: flex;
        gap: 0.5em;
        align-items: center;
    }

    .arrow {
        color: gray;
        font-size: 0.8em;
    }
</style>

<div class="path">
    {#each path as part, i}
        <a href={part.route}>{part.name}</a>
        {#if i < path.length - 1}<i class="fas fa-chevron-right arrow"></i>{/if}
    {/each}
</div>
