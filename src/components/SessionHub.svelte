<script lang="ts">
    import * as consts from "$lib/consts";
    import type { UserSession } from "$lib/types";
    import { userSession } from "$lib/stores";
    import { get } from "svelte/store";

    interface Props {
        user: UserSession;
        userName: string;
        isAdmin: boolean;
        isAnonym: boolean;
    }

    let {
        user = $bindable(),
        userName = $bindable(),
        isAdmin = $bindable(false),
        isAnonym = $bindable(true),
    }: Props = $props();

    $effect(() => {
        user = get(userSession);
    });

    $effect(() => {
        userName = user.name;
    });

    $effect(() => {
        isAdmin = user.code === consts.Account.Admin;
    });

    $effect(() => {
        isAnonym = user.code === consts.Account.Anonym;
    });
</script>
