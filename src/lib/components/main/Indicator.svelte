<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    interface Props {
        title: string;
        count?: number;
        active?: boolean;
        highlightNew?: boolean;
    }

    let {
        title,
        count = 0,
        active = false,
        highlightNew = false
    }: Props = $props();
</script>

<style>
    .cell {
        padding: 0.3em;
        border: 1px solid rgb(208, 208, 253);
        cursor: pointer;
    }

    .active {
        background-color: rgb(166, 249, 255);
    }

    .hightlight {
        color: red;
    }
</style>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<span
    class="cell"
    class:active
    class:hightlight={highlightNew && count}
    onclick={() => dispatch("clicked")}
    >{title}:
    {count}</span
>
