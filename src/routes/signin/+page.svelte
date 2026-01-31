<script lang="ts">
    import * as api from "$lib/api";
    import * as consts from "$lib/consts";
    import { type Error } from "$lib/json-rpc";
    import { goto } from "$app/navigation";
    import { errorMessage, login } from "$lib/network";
    import { createToken } from "$lib/utils";
    import type { UserSession } from "$lib/types";
    import { setSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import BoxForm from "$lib/components/BoxForm.svelte";
    import OperationResult from "$lib/components/OperationResult.svelte";

    const title = "Войти";

    let id = $state(0);
    let password = $state("");

    let signinButtonEnabled = $derived(id && password);
    let error = $state("");

    async function signin() {
        const token = createToken(id, password);

        const params: api.User.Auth.Request = {
            token: token,
        };

        try {
            const result = await api.User.Auth.exec(params);

            const session: UserSession = {
                token: token,
                id: id,
                code: result.code,
                name: result.name,
                isAnonym: false,
                isAdmin: result.code == consts.Account.Admin,
            };

            setSession(session);
            await login(session);
            goto("/");
        } catch (e) {
            error = errorMessage(e as Error);
        }
    }

    function keyPressed(event: any) {
        if (event.key == "Enter") {
            signin();
        }
    }
</script>

<Frame {title}>
    <BoxForm>
        ИД:
        <input type="number" bind:value={id} onkeyup={keyPressed} />
        Пароль:
        <input type="password" bind:value={password} onkeyup={keyPressed} />
        <OperationResult {error} />
        <button onclick={signin} disabled={!signinButtonEnabled}>Войти</button>
    </BoxForm>
</Frame>
