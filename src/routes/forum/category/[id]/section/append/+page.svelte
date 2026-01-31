<script lang="ts">
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import Frame from "$lib/components/Frame.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";
    import SectionEditor from "$lib/components/forum/section/SectionEditor.svelte";

    const title = "Добавить раздел";

    let isAdmin = $state(false);
    let name: string = $state();
    let order: number = $state();

    const action = async () => {
        const params: api.Forum.Section.Create.Request = {
            category_id: +page.params.id,
            name: name,
            order_index: order,
        };

        await api.Forum.Section.Create.exec(params);
        goto(route.Forum.Root);
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    {#if !isAdmin}
        Доступ запрещён
    {:else}
        <SectionEditor bind:name bind:order {action} />
    {/if}
</Frame>
