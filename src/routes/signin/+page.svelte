<script lang="ts">
    import * as api from "$lib/api";
    import { goto } from "$app/navigation";
    import { errorMessage } from "$lib/network";
    import { createToken } from "$lib/utils";
    import type { UserSession } from "$lib/types";
    import { setSession } from "$lib/stores";
    import Frame from "../../components/Frame.svelte";
    import BoxForm from "../../components/BoxForm.svelte";
    import OperationResult from "../../components/OperationResult.svelte";

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
            };

            setSession(session);

            const response = await fetch("/api/user/login", {
                method: "POST",
                body: JSON.stringify(session),
                headers: {
                    "content-type": "application/json",
                },
            });

            const res = await response.json();

            if (!res) {
                error = "Ошибка сохранения сессии";
            } else {
                goto("/");
            }
        } catch (e) {
            error = errorMessage(e);
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
