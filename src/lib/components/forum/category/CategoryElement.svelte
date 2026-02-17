<script lang="ts">
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import SectionElement from "$lib/components/forum/section/SectionElement.svelte";

    interface Props {
        category: api.Forum.GetAll.Category;
        editable?: boolean;
        onremove: () => void;
    }

    let { category, editable = false, onremove }: Props = $props();

    function editCategory() {
        goto(route.Forum.Category.Edit(category.id));
    }

    async function removeCategory() {
        if (!confirm("Удалить категорию?")) return;

        const params: api.Forum.Category.Delete.Request = {
            id: +category.id,
        };
        await api.Forum.Category.Delete.exec(params, $userSession.token);
        onremove();
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
        <button onclick={appendSection} title="Добавить"
            ><i class="far fa-plus-square"></i></button
        >
        <button onclick={editCategory} title="Редактировать"
            ><i class="fas fa-edit"></i></button
        >
        <button onclick={removeCategory} title="Удалить"
            ><i class="fas fa-trash-alt"></i></button
        >
    {/if}
</div>

{#each category.sections as section}
    <SectionElement {section} {editable} {onremove} />
{/each}
