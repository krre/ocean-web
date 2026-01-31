<script lang="ts">
    import { onMount } from "svelte";
    import type { Input } from "$lib/types";
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "$lib/dialog";

    onMount(() => {
        inputRef.focus();
    });

    let { onOk = (_description: string) => {} } = $props();

    let description = $state("Спойлер");

    let inputRef: Input = $state();

    function pressOk() {
        onOk(description);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление спойлера">
    <input
        bind:value={description}
        bind:this={inputRef}
        placeholder="Введите описание"
    />
    {#snippet buttons()}
        <div >
            <button disabled={!description} onclick={pressOk}>ОК</button>
            <button onclick={() => dialog.close()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
