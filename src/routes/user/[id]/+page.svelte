<script lang="ts">
    import * as consts from "$lib/consts";
    import * as api from "$lib/api";
    import * as user from "$lib/api/remote/user.remote";
    import type { PageProps } from "./$types";
    import { userSession } from "$lib/stores";

    import Frame from "$lib/components/Frame.svelte";
    import Profile from "$lib/components/Profile.svelte";

    let { data }: PageProps = $props();
    let isUserExists = $state(true);
    let blocked = $state(false);

    $effect(() => {
        blocked = data.user.blocked;
    });

    async function updateUser() {
        await user.update({
            id: data.user.id,
            name: data.user.name,
            code: data.user.code,
            gender: data.user.gender,
            blocked: data.user.blocked,
            token: $userSession.token,
        });
    }

    async function deleteUser() {
        if (!confirm("Удалить пользователя?")) return;

        await user.deleteAccount({
            id: data.user.id,
            token: $userSession.token,
        });

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

<Frame title="Пользователь">
    {#if data.user.blocked}
        <h3 class="blocked">Акканут заблокирован!</h3>
    {/if}

    <div class="column">
        <div class="grid">
            <div>ИД:</div>
            <div>{data.user.id}</div>
            <div>Имя:</div>
            <div>{data.user.name}</div>
            <div>Пол:</div>
            <div>{consts.Genders[data.user.gender]}</div>

            <Profile user={data.user} />
        </div>

        {#if $userSession.isAdmin && data.user.code === consts.Account.User}
            {#if isUserExists}
                <label>
                    <input
                        type="checkbox"
                        bind:checked={blocked}
                        onchange={() => updateUser()}
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
