<script lang="ts">
    interface Props {
        onselect: (smile: string) => void;
    }

    let { onselect }: Props = $props();
    const smiles: String[] = [];

    // Chars from Unicode table
    for (let i = 0x1f600; i <= 0x1f637; i++) {
        smiles.push(String.fromCodePoint(i));
    }

    for (let i = 0x1f641; i <= 0x1f644; i++) {
        smiles.push(String.fromCodePoint(i));
    }

    for (let i = 0x1f90f; i <= 0x1f917; i++) {
        smiles.push(String.fromCodePoint(i));
    }

    for (let i = 0x1f920; i <= 0x1f92f; i++) {
        smiles.push(String.fromCodePoint(i));
    }

    for (let i = 0x1f44c; i <= 0x1f44f; i++) {
        smiles.push(String.fromCodePoint(i));
    }
</script>

<style>
    .container {
        border-top: var(--border-1px);
        border-left: var(--border-1px);
        border-right: var(--border-1px);
        background-color: white;
        padding: 0.5em;
        line-height: 2em;
        letter-spacing: 1em;
    }

    .smile {
        cursor: pointer;
    }
</style>

<div class="container">
    {#each smiles as smile}
        <span class="smile" onclick={() => onselect(smile)}>{smile}</span>
    {/each}
</div>
