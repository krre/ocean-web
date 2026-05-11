<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="form">
	{@render children?.()}
</div>

<style>
	.form {
		display: grid;
		grid-gap: 0.5em;
		max-width: 400px;
	}
</style>
