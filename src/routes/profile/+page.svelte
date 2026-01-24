<!-- @migration-task Error while migrating Svelte code: `$session` is an illegal variable name. To reference a global variable called `$session`, use `globalThis.$session`
https://svelte.dev/e/global_reference_invalid -->
<script context="module" lang="ts">
    throw new Error(
        "@migration task: Check code was safely removed (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292722)",
    );

    // import * as api from "$lib/api";
    // import type { Session, Page } from "$lib/types";
    // import { createToken } from "$lib/utils";

    // export async function preload(_page: Page, session: Session) {
    //     const params: api.User.GetOne.Request = {
    //         id: +session.user.id,
    //     };

    //     const user = await api.User.GetOne.exec(params);
    //     return { user };
    // }
</script>

<script lang="ts">
    throw new Error(
        "@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)",
    );

    import * as consts from "$lib/consts";
    import { errorMessage } from "$lib/network";
    import type { User } from "$lib/types";
    import { page } from "$app/stores";
    import Frame from "../../components/Frame.svelte";
    import OperationResult from "../../components/OperationResult.svelte";
    import Profile from "../../components/Profile.svelte";

    export let user: User;

    const title = "Профиль";

    let currentGender = user.gender;

    let successProfile: string;
    let errorProfile: string;

    let successPassword: string;
    let errorPassword: string;

    let password1: string;
    let password2: string;

    async function update() {
        const params: api.User.UpdateProfile.Request = {
            name: user.name,
            gender: currentGender,
        };

        try {
            await api.User.UpdateProfile.exec(params);

            $page.data.session.user.name = params.name;
            $page.data.session.user.code = user.code;

            successProfile = "Профиль успешно обновлён";
        } catch (e) {
            errorProfile = errorMessage(e);
        }
    }

    async function changePassword() {
        if (!password1 || !password2) {
            errorPassword = "Введите пароль";
            return;
        }

        if (password1 !== password2) {
            errorPassword = "Пароли не совпадают!";
            return;
        }

        const token = createToken(user.id, password1);

        const params: api.User.UpdateToken.Request = {
            token: token,
        };

        try {
            await api.User.UpdateToken.exec(params);
            $session.user.token = token;

            password1 = "";
            password2 = "";
            successPassword = "Пароль успешно изменён";
        } catch (e) {
            errorPassword = errorMessage(e);
        }
    }
</script>

<style>
    .grid {
        display: grid;
        grid-gap: 0.5em;
        grid-template-columns: max-content auto;
    }
</style>

<Frame {title}>
    <div class="grid">
        <div>ИД:</div>
        <div>{user.id}</div>
        <div>Имя:</div>
        <div><input bind:value={user.name} /></div>
        <div>Пол:</div>
        <div>
            <select bind:value={currentGender}>
                {#each consts.Genders as gender, i}
                    <option value={i}>{gender}</option>
                {/each}
            </select>
        </div>

        <div />
        <div>
            <OperationResult
                bind:success={successProfile}
                bind:error={errorProfile}
            />
        </div>

        <div />
        <div>
            <button on:click={update} disabled={!user.name}>Сохранить</button>
        </div>

        <div>Пароль:</div>
        <div><input type="password" bind:value={password1} /></div>
        <div>Пароль (ещё раз):</div>
        <div><input type="password" bind:value={password2} /></div>

        <div />
        <div>
            <OperationResult
                bind:success={successPassword}
                bind:error={errorPassword}
            />
        </div>

        <div />
        <div><button on:click={changePassword}>Изменить</button></div>

        <Profile {user} />
    </div>
</Frame>
