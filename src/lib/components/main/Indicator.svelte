<script lang="ts">
    interface Props {
        title: string;
        count?: number;
        active?: boolean;
        highlightNew?: boolean;
        onclick: () => void;
    }

    let {
        title,
        count = 0,
        active = false,
        highlightNew = false,
        onclick,
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

<span
    class="cell"
    class:active
    class:hightlight={highlightNew && count}
    {onclick}
    >{title}:
    {count}</span
>
