<script lang="ts">
    import type { Input } from "$lib/types";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import * as dialog from "$lib/dialog";

    let { onOk = (_description: string) => {} } = $props();

    let description = $state("Спойлер");
    let inputRef = $state<Input | undefined>(undefined);

    $effect(() => {
        inputRef?.focus();
    });

    function pressOk() {
        onOk(description);
        dialog.close();
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
            <button onclick={() => dialog.close()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
