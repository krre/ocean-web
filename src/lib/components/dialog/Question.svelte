<script lang="ts">
    import Dialog from "./Dialog.svelte";
    import * as dialog from "$lib/dialog";
    interface Props {
        title: string;
        text: string;
    }

    let { title, text }: Props = $props();
</script>

<style>
</style>

<Dialog {title}>
    <div>{text}</div>
    {#snippet buttons()}
        <button  onclick={() => dialog.close()}>Закрыть</button>
    {/snippet}
</Dialog>
