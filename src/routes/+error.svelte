<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import * as route from "$lib/route";
    import { Code, printMessage } from "$lib/api-error";
    import Frame from "$lib/components/Frame.svelte";

    $effect(() => {
        if (page.error?.code == Code.AccountBlocked) {
            goto(route.Signout);
        }
    });
</script>

<Frame title={String(page.status)}>
    <p>{printMessage(page.error?.code || 0, page.error?.message || "")}</p>
</Frame>
