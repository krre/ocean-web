<script lang="ts">
    import { onMount } from "svelte";
    import type { Input } from "$lib/types";
    import Dialog from "../dialog/Dialog.svelte";
    import * as dialog from "$lib/dialog";

    onMount(() => {
        inputRef.focus();
    });

    let { onOk = (_link: string) => {} } = $props();

    let link: string = $state();

    let inputRef: Input = $state();

    function pressOk() {
        onOk(link);
        dialog.close();
    }
</script>

<style>
</style>

<Dialog title="Добавление ссылки">
    <input
        bind:value={link}
        bind:this={inputRef}
        placeholder="Введите ссылку"
    />
    {#snippet buttons()}
        <div >
            <button disabled={!link} onclick={pressOk}>ОК</button>
            <button onclick={() => dialog.close()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
