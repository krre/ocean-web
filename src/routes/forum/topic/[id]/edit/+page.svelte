<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(page: Page, _session: Session) {
        const { id } = page.params;
        const params: api.Forum.Topic.GetOne.Request = {
            id: +id,
        };

        const result = await api.Forum.Topic.GetOne.exec(params);
        const name = result.name;
        const sectionId = result.section_id;
        const userId = result.user_id;

        return { id, sectionId, name, userId };
    }
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import type { User } from "$lib/types";
    import * as route from "$lib/route";
    import Frame from "$lib/components/Frame.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";

    const title = "Редактировать тему";

    interface Props {
        id: number;
        sectionId: number;
        name: string;
        userId: number;
    }

    let { id, sectionId, name = $bindable(), userId }: Props = $props();

    let isAdmin = $state(false);
    let isAnonym = $state(true);
    let user: User = $state();

    let editable = $derived(
        isAdmin || (user && user.id === userId && !isAnonym),
    );

    const action = async () => {
        const params: api.Forum.Topic.Update.Request = {
            id: +id,
            name: name,
        };

        await api.Forum.Topic.Update.exec(params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<style>
    .form {
        display: grid;
        gap: 0.8em;
    }
</style>

<SessionHub bind:isAdmin bind:isAnonym bind:user />

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
