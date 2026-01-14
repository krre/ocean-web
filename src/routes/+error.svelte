<script lang="ts">
    import { run } from "svelte/legacy";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import { Code, printMessage } from "$lib/api-error";
    import Frame from "../components/Frame.svelte";

    run(() => {
        if (page.error?.code == Code.AccountBlocked) {
            goto(route.Signout);
        }
    });
</script>

<Frame title={String(page.status)}>
    <p>{printMessage(page.error?.code || 0, page.error?.message || "")}</p>
</Frame>
