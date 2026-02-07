<script lang="ts">
    import type { Input } from "$lib/types";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import * as dialog from "$lib/dialog";

    let { onOk = (_link: string) => {} } = $props();

    let link = $state("");
    let inputRef = $state<Input | undefined>(undefined);

    $effect(() => {
        inputRef?.focus();
    });

    function pressOk() {
        onOk(link);
        dialog.close();
    }
</script>

<Dialog title="Добавление видео YouTube">
    <input
        bind:value={link}
        bind:this={inputRef}
        placeholder="Введите ссылку"
    />
    {#snippet buttons()}
        <div>
            <button disabled={!link} onclick={pressOk}>ОК</button>
            <button onclick={() => dialog.close()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
