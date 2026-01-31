<script lang="ts">
    interface Props {
        padding?: boolean;
        solid?: boolean;
        children?: import('svelte').Snippet;
    }

    let { padding = true, solid = true, children }: Props = $props();
</script>

<style>
    .rect {
        margin: var(--page-margin);
    }

    @media screen and (max-width: 600px) {
        .rect {
            margin: var(--page-margin) 0;
        }
    }

    .solid {
        background-color: white;
        border: var(--border-1px);
    }

    .padding {
        padding: 1em;
    }
</style>

<div class="rect" class:solid class:padding>
    {@render children?.()}
</div>
