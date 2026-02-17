<script lang="ts">
    import type { Input } from "$lib/types";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import { closeDialog } from "$lib/stores";

    let { onOk = (_link: string) => {} } = $props();

    let link = $state("");
    let inputRef = $state<Input | undefined>(undefined);

    $effect(() => {
        inputRef?.focus();
    });

    function pressOk() {
        onOk(link);
        closeDialog();
    }
</script>

<Dialog title="Добавление ссылки">
    <input
        bind:value={link}
        bind:this={inputRef}
        placeholder="Введите ссылку"
    />
    {#snippet buttons()}
        <div>
            <button disabled={!link} onclick={pressOk}>ОК</button>
            <button onclick={() => closeDialog()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
