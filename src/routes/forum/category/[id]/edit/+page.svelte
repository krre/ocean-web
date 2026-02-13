<script lang="ts">
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import Frame from "$lib/components/Frame.svelte";
    import CategoryEditor from "$lib/components/forum/category/CategoryEditor.svelte";
    import type { PageProps } from "./$types";

    const title = "Редактировать категорию";

    const { data }: PageProps = $props();

    let name = $state("");
    let order = $state(0);

    $effect(() => {
        name = data.getOneResponse.name;
        order = data.getOneResponse.order_index;
    });

    const action = async () => {
        const params: api.Forum.Category.Update.Request = {
            id: data.id,
            name: name,
            order_index: order,
        };

        await api.Forum.Category.Update.exec(params, $userSession.token);
        goto(route.Forum.Root);
    };
</script>

<Frame {title}>
    {#if !$userSession.isAdmin}
        Доступ запрещён
    {:else}
        <CategoryEditor bind:name bind:order {action} />
    {/if}
</Frame>
