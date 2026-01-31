<script lang="ts">
    import Menu from "./Menu.svelte";
    interface Props {
        open?: boolean;
    }

    let { open = false }: Props = $props();
</script>

<style>
    aside {
        position: absolute;
        width: 50%;
        height: 100%;
        left: -50%;
        transition: left 0.3s ease-in-out;
        background-color: slateblue;
    }

    aside :global(.menu) {
        flex-direction: column;
        margin-top: 50px;
    }

    .open {
        left: 0;
    }
</style>

<aside class:open>
    <Menu class="menu" on:itemClicked />
</aside>
