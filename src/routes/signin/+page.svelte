<script lang="ts">
    import { type Error } from "$lib/json-rpc";
    import { goto } from "$app/navigation";
    import { errorMessage } from "$lib/network";
    import { login } from "$lib/api/remote/user.remote";
    import { createToken } from "$lib/utils";
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

        try {
            const userSession = await login({ id, token });
            setSession(userSession);
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
