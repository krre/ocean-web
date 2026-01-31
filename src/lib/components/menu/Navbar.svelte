<script lang="ts">
    import Menu from "./Menu.svelte";
    import Burger from "./Burger.svelte";

    interface Props {
        sidebar?: boolean;
    }

    let { sidebar = $bindable(false) }: Props = $props();
</script>

<style>
    .bar {
        background-color: slateblue;
        height: 48px;
        box-shadow: 0 3px 8px 0px rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
    }

    .burger {
        display: block;
    }

    .menu {
        display: block;
    }

    @media screen and (max-width: 45em) {
        .burger {
            display: block;
        }

        .menu {
            display: none;
        }
    }

    @media screen and (min-width: 45em) {
        .burger {
            display: none;
        }

        .menu {
            display: block;
        }
    }
</style>

<div class="bar">
    <div class="burger">
        <Burger bind:open={sidebar} />
    </div>

    <div class="menu">
        <Menu />
    </div>
</div>
