<script lang="ts">
    interface Props {
        title: string;
        children?: import('svelte').Snippet;
        buttons?: import('svelte').Snippet;
    }

    let { title, children, buttons }: Props = $props();
</script>

<style>
    .window-wrapper {
        position: relative;
        margin: 1em;
        max-height: 100%;
    }

    .window {
        position: relative;
        width: 40em;
        max-width: 100%;
        max-height: 100%;
        margin: 1em auto;
        background: var(--page-background);
    }

    .title {
        text-align: center;
        padding: 1em;
        margin: 0;
    }

    .content {
        margin: 0 var(--page-margin);
        white-space: pre-wrap;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    .buttons {
        padding: 1em;
        display: flex;
        justify-content: center;
    }
</style>

<div class="window-wrapper">
    <div class="window" role="dialog" aria-modal="true">
        <h2 class="title">{title}</h2>
        <div class="content">
            {@render children?.()}
        </div>
        <div class="buttons">
            {#if buttons}{@render buttons()}{:else}Кнопки не добавлены{/if}
        </div>
    </div>
</div>
