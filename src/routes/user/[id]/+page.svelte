<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(page: Page, _session: Session) {
        const params: api.User.GetOne.Request = {
            id: +page.params.id,
        };

        const user = await api.User.GetOne.exec(params);
        return { user };
    }
</script>

<script lang="ts">
    import * as consts from "$lib/consts";
    import * as dialog from "$lib/dialog";
    import Frame from "$lib/components/Frame.svelte";
    import Profile from "$lib/components/Profile.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";

    interface Props {
        user: api.User.GetOne.Response;
    }

    let { user = $bindable() }: Props = $props();
    let isAdmin = $state(false);
    let isUserExists = $state(true);

    async function updateUser() {
        const params: api.User.Update.Request = {
            id: user.id,
            name: user.name,
            code: user.code,
            gender: user.gender,
            blocked: user.blocked,
        };

        await api.User.Update.exec(params);
    }

    async function deleteUser() {
        if (!dialog.remove("Удалить пользователя?")) return;

        const params: api.User.Delete.Request = {
            id: user.id,
        };

        await api.User.Delete.exec(params);
        isUserExists = false;
    }
</script>

<style>
    .blocked {
        color: red;
        margin-top: 0;
    }

    .column {
        display: flex;
        gap: 0.5em;
        flex-direction: column;
    }

    .grid {
        display: grid;
        grid-template-columns: max-content auto;
        gap: 0.5em;
    }

    .message {
        color: red;
    }
</style>

<SessionHub bind:isAdmin />

<Frame title="Пользователь">
    {#if user.blocked}
        <h3 class="blocked">Акканут заблокирован!</h3>
    {/if}

    <div class="column">
        <div class="grid">
            <div>ИД:</div>
            <div>{user.id}</div>
            <div>Имя:</div>
            <div>{user.name}</div>
            <div>Пол:</div>
            <div>{consts.Genders[user.gender]}</div>

            <Profile {user} />
        </div>

        {#if isAdmin && user.code === consts.Account.User}
            {#if isUserExists}
                <label>
                    <input
                        type="checkbox"
                        bind:checked={user.blocked}
                        onchange={(_) => updateUser()}
                    />
                    Заблокировано
                </label>

                <div>
                    <button onclick={deleteUser}>Удалить</button>
                </div>
            {:else}
                <div class="message">Пользователь удалён</div>
            {/if}
        {/if}
    </div>
</Frame>
