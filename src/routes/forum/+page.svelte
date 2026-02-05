<script lang="ts">
    import * as api from "$lib/api";
    import * as route from "$lib/route";
    import { goto } from "$app/navigation";
    import type { PageProps } from "./$types";
    import { userSession } from "$lib/stores";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import CategoryElement from "$lib/components/forum/category/CategoryElement.svelte";

    let { data }: PageProps = $props();

    let editable = $state(false);
    let categories: api.Forum.GetAll.Category[] = $derived.by(() => {
        let categories = [];

        for (let category of data.getAllResponse.categories) {
            let sections: api.Forum.GetAll.Section[] = [];

            for (let section of data.getAllResponse.sections) {
                if (section.category_id === category.id) {
                    sections.push(section);
                }
            }

            category.sections = sections;
            categories.push(category);
        }

        return categories;
    });

    async function reload() {
        goto(route.Forum.Root);
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

{#if $userSession.isAdmin}
    <div style="margin-left: 1em">
        {#if editable}<button onclick={append} title="Добавить"
                ><i class="far fa-plus-square"></i></button
            >{/if}
        <button onclick={() => (editable = !editable)} title="Редактировать"
            ><i class="fas fa-edit"></i></button
        >
    </div>
{/if}
