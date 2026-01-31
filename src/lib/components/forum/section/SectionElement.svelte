<script lang="ts">
    import * as route from "$lib/route";
    import * as dialog from "$lib/dialog";
    import * as api from "$lib/api";
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    interface Props {
        section: api.Forum.Section.GetAll.Section;
        editable?: boolean;
    }

    let { section, editable = false }: Props = $props();

    function editSection() {
        goto(route.Forum.Section.Edit(section.id));
    }

    async function removeSection() {
        if (!dialog.remove("Удалить секцию?")) return;

        const params: api.Forum.Section.Delete.Request = {
            id: +section.id,
        };
        await api.Forum.Section.Delete.exec(params);
        dispatch("removed");
    }
</script>

<style>
    .section {
        padding: var(--page-padding);
        border-bottom: var(--border-1px);
    }

    .section:last-child {
        border-bottom: none;
    }

    .info {
        margin-top: 0.5em;
        color: rgb(90, 90, 90);
    }

    button {
        margin-left: 0.5em;
        color: gray;
    }
</style>

<div class="section">
    <a href={route.Forum.Section.Id(section.id)}>{section.name}</a>
    {#if editable}
        <button onclick={editSection}><i class="fas fa-edit"></i></button>
        <button onclick={removeSection}><i class="fas fa-trash-alt"></i></button>
    {/if}
    <div class="info">
        Тем: {section.topic_count} · Постов: {section.post_count}
    </div>
</div>
