<script lang="ts">
    import Rectangle from "./Rectangle.svelte";
    interface Props {
        title: string;
        showHeader?: boolean;
        showContent?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        title,
        showHeader = true,
        showContent = true,
        children
    }: Props = $props();
</script>

<style>
    .header {
        padding-left: calc(var(--page-padding) / 2);
        margin-left: 0;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#if showHeader}
    <h1 class="header">{title}</h1>
{/if}

{#if showContent}
    <Rectangle>
        {@render children?.()}
    </Rectangle>
{/if}
