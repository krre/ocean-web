<script lang="ts">
    import * as route from "$lib/route";
    import { userSession } from "$lib/stores";
    import { goto, invalidateAll } from "$app/navigation";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import SectionElement from "$lib/components/forum/section/SectionElement.svelte";
    import Navigator from "$lib/components/forum/main/Navigator.svelte";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    const categoryName = $derived(data.getAllResponse.category_name);
    const sections = $derived(data.getAllResponse.sections);

    function append() {
        goto(route.Forum.Section.Append(data.categoryId));
    }

    async function reload() {
        invalidateAll();
    }
</script>

<style>
    button {
        margin-left: var(--page-margin);
        color: gray;
    }
</style>

<Navigator />

<FramePage title={categoryName}>
    {#each sections as section}
        <SectionElement {section} on:removed={() => reload()} />
    {/each}
</FramePage>

{#if $userSession.isAdmin}
    <button onclick={append} title="Добавить"
        ><i class="far fa-plus-square"></i></button
    >
{/if}
