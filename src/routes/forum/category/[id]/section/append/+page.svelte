<script lang="ts">
    import * as route from "$lib/route";
    import * as section from "$lib/api/remote/forum/section.remote";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import SectionEditor from "$lib/components/forum/section/SectionEditor.svelte";

    const title = "Добавить раздел";

    let name = $state("");
    let order = $state(0);

    const action = async () => {
        await section.create({
            category_id: +(page.params.id ?? ""),
            name: name,
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
        <SectionEditor bind:name bind:order {action} />
    {/if}
</Frame>
