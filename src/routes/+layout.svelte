<script lang="ts">
	import Modal from '$lib/components/dialog/Modal.svelte';
	import Navbar from '$lib/components/menu/Navbar.svelte';
	import Sidebar from '$lib/components/menu/Sidebar.svelte';
	import type { LayoutProps } from './$types';
	import './layout.css';

	let { children }: LayoutProps = $props();
	let open = $state(false);
</script>

<Sidebar bind:open onclick={() => (open = false)} />
<Navbar bind:sidebar={open} />

<main>
	{@render children?.()}
	<Modal />
</main>
