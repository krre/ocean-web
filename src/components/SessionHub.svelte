<script lang="ts">
    import { run } from "svelte/legacy";

    import * as consts from "$lib/consts";
    import type { User } from "$lib/types";
    import { page } from "$app/stores";

    interface Props {
        user?: User;
        userName?: string;
        isAdmin?: boolean;
        isAnonym?: boolean;
    }

    let {
        user = $bindable(undefined),
        userName = $bindable(),
        isAdmin = $bindable(false),
        isAnonym = $bindable(true),
    }: Props = $props();

    run(() => {
        userName = user
            ? user.name
            : consts.Account.ModeNames[consts.Account.Anonym];
    });
    run(() => {
        user = $page.data.session?.user as User;
    });
    run(() => {
        isAdmin = user ? user.code === consts.Account.Admin : false;
    });
    run(() => {
        isAnonym = !user || user.code === consts.Account.Anonym;
    });
</script>
