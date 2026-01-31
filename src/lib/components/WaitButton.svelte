<script lang="ts">
    import { errorMessage } from "$lib/network";
    import { type Error } from "$lib/json-rpc";
    import Loader from "./Loader.svelte";
    import OperationResult from "$lib/components/OperationResult.svelte";

    interface Props {
        title: string;
        enabled?: boolean;
        sendAction?: any;
    }

    let {
        title,
        enabled = $bindable(true),
        sendAction = async () => {},
    }: Props = $props();

    let sending = $state(false);
    let error: string = $state("");

    async function action() {
        let timerId = setTimeout(() => (sending = true), 200);
        enabled = false;

        try {
            await sendAction();
        } catch (e) {
            error = errorMessage(e as Error);
        }

        clearTimeout(timerId);
        sending = false;
    }
</script>

<style>
    .container {
        display: flex;
        gap: 0.5em;
    }
</style>

<div class="container">
    <button onclick={action} disabled={!enabled}>{title}</button>

    {#if sending}
        <Loader scale={0.3} />
    {/if}

    <OperationResult {error} />
</div>
