<script lang="ts">
    import * as consts from "$lib/consts";
    import * as api from "$lib/api";
    import { type Error } from "$lib/json-rpc";
    import { errorMessage, login } from "$lib/network";
    import Frame from "../../components/Frame.svelte";
    import OperationResult from "../../components/OperationResult.svelte";
    import Profile from "../../components/Profile.svelte";
    import type { PageProps } from "./$types";
    import { createToken } from "$lib/utils";
    import { session, setSession } from "$lib/stores";

    let { data }: PageProps = $props();

    let userSession = session();

    const title = "Профиль";

    let currentGender = $derived(data.user.gender);

    let successProfile = $state("");
    let errorProfile = $state("");

    let successPassword = $state("");
    let errorPassword = $state("");

    let password1 = $state("");
    let password2 = $state("");

    async function update() {
        const params: api.User.UpdateProfile.Request = {
            name: data.user.name,
            gender: currentGender,
        };

        try {
            await api.User.UpdateProfile.exec(params);

            userSession.name = data.user.name;
            setSession(userSession);
            login(userSession);

            successProfile = "Профиль успешно обновлён";
        } catch (e) {
            errorProfile = errorMessage(e as Error);
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

        const token = createToken(data.user.id, password1);

        const params: api.User.UpdateToken.Request = {
            token: token,
        };

        try {
            await api.User.UpdateToken.exec(params);

            userSession.token = token;
            setSession(userSession);
            login(userSession);

            password1 = "";
            password2 = "";
            successPassword = "Пароль успешно изменён";
        } catch (e) {
            errorPassword = errorMessage(e as Error);
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
        <div>{data.user.id}</div>
        <div>Имя:</div>
        <div><input bind:value={data.user.name} /></div>
        <div>Пол:</div>
        <div>
            <select bind:value={currentGender}>
                {#each consts.Genders as gender, i}
                    <option value={i}>{gender}</option>
                {/each}
            </select>
        </div>

        <div></div>
        <div>
            <OperationResult success={successProfile} error={errorProfile} />
        </div>

        <div></div>
        <div>
            <button onclick={update} disabled={!data.user.name}
                >Сохранить</button
            >
        </div>

        <div>Пароль:</div>
        <div><input type="password" bind:value={password1} /></div>
        <div>Пароль (ещё раз):</div>
        <div><input type="password" bind:value={password2} /></div>

        <div></div>
        <div>
            <OperationResult success={successPassword} error={errorPassword} />
        </div>

        <div><button onclick={changePassword}>Изменить</button></div>

        <Profile user={data.user} />
    </div>
</Frame>
