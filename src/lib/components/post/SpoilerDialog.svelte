<script lang="ts">
    import type { Input } from "$lib/types";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import { closeDialog } from "$lib/stores";

    let { onOk = (_description: string) => {} } = $props();

    let description = $state("Спойлер");
    let inputRef = $state<Input | undefined>(undefined);

    $effect(() => {
        inputRef?.focus();
    });

    function pressOk() {
        onOk(description);
        closeDialog();
    }
</script>

<Dialog title="Добавление спойлера">
    <input
        bind:value={description}
        bind:this={inputRef}
        placeholder="Введите описание"
    />
    {#snippet buttons()}
        <div>
            <button disabled={!description} onclick={pressOk}>ОК</button>
            <button onclick={() => closeDialog()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
