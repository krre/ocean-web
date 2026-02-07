<script lang="ts">
    import type { Input } from "$lib/types";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import * as dialog from "$lib/dialog";

    let { onOk = (_link: string, _width?: number) => {} } = $props();

    let link = $state("");
    let width = $state(0);
    let inputRef = $state<Input | undefined>(undefined);

    $effect(() => {
        inputRef?.focus();
    });

    function pressOk() {
        onOk(link, width);
        dialog.close();
    }
</script>

<Dialog title="Добавление изображения">
    <input
        bind:value={link}
        bind:this={inputRef}
        placeholder="Введите ссылку"
    />
    <input bind:value={width} placeholder="Введите ширину (не обязательно)" />
    {#snippet buttons()}
        <div>
            <button disabled={!link} onclick={pressOk}>ОК</button>
            <button onclick={() => dialog.close()}>Отменить</button>
        </div>
    {/snippet}
</Dialog>
