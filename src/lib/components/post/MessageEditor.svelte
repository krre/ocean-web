<script lang="ts">
    import PostEditor from "./PostEditor.svelte";
    import Rectangle from "../Rectangle.svelte";
    import SessionHub from "../SessionHub.svelte";
    import WaitButton from "../WaitButton.svelte";

    interface Props {
        message?: string;
        sendButtonEnabled?: boolean;
        sendAction?: any;
    }

    let { message = $bindable(""), sendButtonEnabled = true, sendAction = async () => {} }: Props = $props();

    let userName: string = $state();
    let postEditorRef: PostEditor = $state();

    export function appendReply(userName: string, text: string) {
        postEditorRef.appendReply(userName, text);
    }

    async function action() {
        await sendAction();
        message = "";
    }
</script>

<style>
    .wait-button {
        margin-top: 0.5em;
    }
</style>

<SessionHub bind:userName />

<Rectangle padding={false} solid={false}>
    <PostEditor bind:post={message} bind:this={postEditorRef} />

    <div>Пользователь: {userName}</div>

    <div class="wait-button">
        <WaitButton
            title="Отправить"
            enabled={message.length > 0 && sendButtonEnabled}
            sendAction={action}
        />
    </div>
</Rectangle>
