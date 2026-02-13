<script lang="ts">
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import CategoryEditor from "$lib/components/forum/category/CategoryEditor.svelte";

    const title = "Добавить категорию";

    let name = $state("");
    let order = $state(0);

    const action = async () => {
        const params: api.Forum.Category.Create.Request = {
            name: name,
            order_index: order,
        };

        await api.Forum.Category.Create.exec(params, $userSession.token);
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
