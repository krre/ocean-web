<script lang="ts">
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import SectionEditor from "$lib/components/forum/section/SectionEditor.svelte";

    const title = "Добавить раздел";

    let name = $state("");
    let order = $state(0);

    const action = async () => {
        const params: api.Forum.Section.Create.Request = {
            category_id: +(page.params.id ?? ""),
            name: name,
            order_index: order,
        };

        await api.Forum.Section.Create.exec(params, $userSession.token);
        goto(route.Forum.Root);
    };
</script>

<Frame {title}>
    {#if !$userSession.isAdmin}
        Доступ запрещён
    {:else}
        <SectionEditor bind:name bind:order {action} />
    {/if}
</Frame>
