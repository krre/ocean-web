<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { goto } from "$app/navigation";
    import { createToken } from "$lib/utils";
    import Frame from "$lib/components/Frame.svelte";
    import BoxForm from "$lib/components/BoxForm.svelte";
    import OperationResult from "$lib/components/OperationResult.svelte";

    const title = "Регистрация";

    let error = $state("");

    let name = $state("");
    let password1 = $state("");
    let password2 = $state("");

    let singupButtonEnabled = $derived(password1 && password2 && name);

    async function signup() {
        if (password1 !== password2) {
            error = "Пароли не совпадают!";
            return;
        }

        const result = await api.User.GetNextId.exec();
        const id = result.id;

        const params: api.User.Create.Request = {
            id: id,
            name: name.trim(),
            code: consts.Account.User,
            token: createToken(id, password1),
        };

        await api.User.Create.exec(params);
        goto(route.Register.UserId(id));
    }
</script>

<Frame {title}>
    <BoxForm>
        Имя:
        <input bind:value={name} />
        Пароль:
        <input type="password" bind:value={password1} />
        Пароль (ещё раз):
        <input type="password" bind:value={password2} />
        <OperationResult {error} />
        <button onclick={signup} disabled={!singupButtonEnabled}>
            Зарегистрироваться
        </button>
    </BoxForm>
</Frame>
