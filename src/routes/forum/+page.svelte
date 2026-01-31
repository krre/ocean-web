<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(_page: Page, _session: Session) {
        const getAllResponse = await api.Forum.GetAll.exec();

        return {
            getAllResponse,
        };
    }
</script>

<script lang="ts">
    import * as route from "$lib/route";
    import type { User } from "$lib/types";
    import { goto } from "$app/navigation";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";
    import CategoryElement from "$lib/components/forum/category/CategoryElement.svelte";

    interface Props {
        getAllResponse: api.Forum.GetAll.Response;
    }

    let { getAllResponse = $bindable() }: Props = $props();

    let isAdmin = $state(false);
    let editable = $state(false);
    let user: User = $state();
    let categories: api.Forum.GetAll.Category[] = $state([]);

    $effect(() => {
        categories = [];

        for (let category of getAllResponse.categories) {
            let sections: api.Forum.GetAll.Section[] = [];

            for (let section of getAllResponse.sections) {
                if (section.category_id === category.id) {
                    sections.push(section);
                }
            }

            category.sections = sections;
            categories.push(category);
        }

        categories = categories;
    });

    async function reload() {
        getAllResponse = await api.Forum.GetAll.exec();
    }

    function append() {
        goto(route.Forum.Category.Append);
    }
</script>

<style>
    .new {
        margin: var(--page-margin) 0 0 var(--page-margin);
    }

    button {
        margin-left: 0.2em;
        color: gray;
    }
</style>

<SessionHub bind:user bind:isAdmin />

<div class="new"><a href={route.Forum.New}>Новые сообщения</a></div>

<FramePage title="Форум" showHeader={false}>
    <div>
        {#each categories as category}
            <CategoryElement
                {category}
                {editable}
                on:removed={() => reload()}
            />
        {/each}
    </div>
</FramePage>

{#if isAdmin}
    <div style="margin-left: 1em">
        {#if editable}<button onclick={append}
                ><i class="far fa-plus-square"></i></button
            >{/if}
        <button onclick={() => (editable = !editable)}
            ><i class="fas fa-edit"></i></button
        >
    </div>
{/if}
