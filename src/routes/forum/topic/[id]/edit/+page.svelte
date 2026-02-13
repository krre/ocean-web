<script lang="ts">
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import type { PageProps } from "./$types";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";

    const title = "Редактировать тему";

    const { data }: PageProps = $props();

    let name = $state("");

    $effect(() => {
        name = data.getOneResponse.name;
    });

    let editable = $derived(
        $userSession.isAdmin ||
            (!$userSession.isAnonym &&
                $userSession.id === data.getOneResponse.user_id),
    );

    const action = async () => {
        const params: api.Forum.Topic.Update.Request = {
            id: data.id,
            name: name,
        };

        await api.Forum.Topic.Update.exec(params, $userSession.token);
        goto(route.Forum.Section.Id(data.getOneResponse.section_id));
    };
</script>

<style>
    .form {
        display: grid;
        gap: 0.8em;
    }
</style>

<Frame {title}>
    {#if !editable}
        Доступ запрещён
    {:else}
        <div class="form">
            Название: <input type="text" bind:value={name} />
            <div>
                <button onclick={action} disabled={!name}>Отправить</button>
            </div>
        </div>
    {/if}
</Frame>
