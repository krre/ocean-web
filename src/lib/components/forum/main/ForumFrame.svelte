<script lang="ts">
    import Rectangle from "../../Rectangle.svelte";
    interface Props {
        title: string;
        showHeader?: boolean;
        showPoll?: boolean;
        showContent?: boolean;
        button?: import('svelte').Snippet;
        poll?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let {
        title,
        showHeader = true,
        showPoll = false,
        showContent = true,
        button,
        poll,
        children
    }: Props = $props();
</script>

<style>
    .header {
        padding-left: calc(var(--page-padding) / 2);
        margin-left: 0;
    }

    .btn {
        margin-right: var(--page-margin);
        display: flex;
        justify-content: flex-end;
    }
</style>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#if showHeader}
    <h1 class="header">{title}</h1>
{/if}

<div class="btn">
    {@render button?.()}
</div>

{#if showPoll}
    <Rectangle>
        {@render poll?.()}
    </Rectangle>
{/if}

{#if showContent}
    <Rectangle padding={false}>
        {@render children?.()}
    </Rectangle>
{/if}
