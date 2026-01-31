<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import PostEditor from "../post/PostEditor.svelte";
    import WaitButton from "../../components/WaitButton.svelte";

    const dispatch = createEventDispatcher();
    interface Props {
        text: string;
        sendAction?: any;
    }

    let { text = $bindable(), sendAction = async (_text: string) => {} }: Props = $props();

    function cancel() {
        dispatch("cancel");
    }
</script>

<style>
    button {
        margin-right: 0.5em;
    }

    .row-btn {
        display: flex;
        margin-top: 0.5em;
        gap: 0.5em;
    }
</style>

<PostEditor bind:post={text} />

<div class="row-btn">
    <WaitButton
        title="Отправить"
        enabled={text.length > 0}
        sendAction={() => sendAction(text)}
    />
    <button onclick={cancel}>Отменить</button>
</div>
