<script lang="ts">
    import PostEditor from "$lib/components/post/PostEditor.svelte";
    import WaitButton from "$lib/components/WaitButton.svelte";

    interface Props {
        text: string;
        sendAction?: any;
        oncancel: () => void;
    }

    let {
        text = $bindable(),
        sendAction = async (_text: string) => {},
        oncancel,
    }: Props = $props();
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
    <button onclick={oncancel}>Отменить</button>
</div>
