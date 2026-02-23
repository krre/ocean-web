<script lang="ts">
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import * as route from "$lib/route";
    import * as category from "$lib/api/remote/forum/category.remote";
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
        await category.update({
            id: data.id,
            name,
            order_index: order,
            token: $userSession.token,
        });

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
