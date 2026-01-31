<script lang="ts">
    import type { ActivityMessage } from "$lib/types";
    import Latest from "./Latest.svelte";
    import Feed from "./Feed.svelte";

    interface Props {
        comments?: ActivityMessage[];
        topics?: ActivityMessage[];
    }

    let { comments = [], topics = [] }: Props = $props();
</script>

<style>
    .container {
        flex-basis: 25em;
        min-width: min(100%, 25em);
    }
</style>

<div class="container">
    <Feed />
    <Latest title="Последние комментарии к манделам" messages={comments} />
    <Latest title="Последние сообщения форума" messages={topics} />
</div>
