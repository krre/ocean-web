<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<style>
    .form {
        display: grid;
        grid-gap: 0.5em;
        max-width: 400px;
    }
</style>

<div class="form">
    {@render children?.()}
</div>
