<script lang="ts">
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import Frame from "$lib/components/Frame.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";
    import CategoryEditor from "$lib/components/forum/category/CategoryEditor.svelte";

    const title = "Добавить категорию";

    let isAdmin = $state(false);
    let name: string = $state();
    let order: number = $state();

    const action = async () => {
        const params: api.Forum.Category.Create.Request = {
            name: name,
            order_index: order,
        };

        await api.Forum.Category.Create.exec(params);
        goto(route.Forum.Root);
    };
</script>

<SessionHub bind:isAdmin />

<Frame {title}>
    {#if !isAdmin}
        Доступ запрещён
    {:else}
        <CategoryEditor bind:name bind:order {action} />
    {/if}
</Frame>
