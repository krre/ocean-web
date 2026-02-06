<script lang="ts">
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import SectionEditor from "$lib/components/forum/section/SectionEditor.svelte";
    import type { PageProps } from "../$types";

    const title = "Редактировать раздел";

    const { data }: PageProps = $props();

    let name = $state("");
    let order = $state(0);

    $effect(() => {
        name = data.getOneResponse.name;
        order = data.getOneResponse.order_index;
    });

    const action = async () => {
        const params: api.Forum.Section.Update.Request = {
            id: data.id,
            name,
            order_index: order,
        };

        await api.Forum.Section.Update.exec(params);
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
