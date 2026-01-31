<script lang="ts">
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import * as dialog from "$lib/dialog";
    import { goto } from "$app/navigation";

    import { createEventDispatcher } from "svelte";
    import SectionElement from "../section/SectionElement.svelte";

    const dispatch = createEventDispatcher();

    interface Props {
        category: api.Forum.GetAll.Category;
        editable?: boolean;
    }

    let { category, editable = false }: Props = $props();

    function editCategory() {
        goto(route.Forum.Category.Edit(category.id));
    }

    async function removeCategory() {
        if (!dialog.remove("Удалить категорию?")) return;

        const params: api.Forum.Category.Delete.Request = {
            id: +category.id,
        };
        await api.Forum.Category.Delete.exec(params);
        dispatch("removed");
    }

    function appendSection() {
        goto(route.Forum.Section.Append(category.id));
    }
</script>

<style>
    .header {
        background-color: rgb(228, 237, 241);
        border-bottom: var(--border-1px);
    }

    h3 {
        padding-left: 1em;
        display: inline-block;
    }

    button {
        margin-left: 0.2em;
        color: gray;
    }
</style>

<div class="header">
    <h3>{category.name}</h3>
    {#if editable}
        <button onclick={appendSection}
            ><i class="far fa-plus-square"></i></button
        >
        <button onclick={editCategory}><i class="fas fa-edit"></i></button>
        <button onclick={removeCategory}><i class="fas fa-trash-alt"></i></button
        >
    {/if}
</div>

{#each category.sections as section}
    <SectionElement {section} {editable} on:removed />
{/each}
