<script lang="ts">
    import { userSession } from "$lib/stores";
    import PostEditor from "./PostEditor.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import WaitButton from "$lib/components/WaitButton.svelte";

    interface Props {
        message?: string;
        sendButtonEnabled?: boolean;
        sendAction?: any;
    }

    let {
        message = $bindable(""),
        sendButtonEnabled = true,
        sendAction = async () => {},
    }: Props = $props();

    let postEditorRef: PostEditor | undefined = $state(undefined);

    export function appendReply(userName: string, text: string) {
        postEditorRef?.appendReply(userName, text);
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

<Rectangle padding={false} solid={false}>
    <PostEditor bind:post={message} bind:this={postEditorRef} />

    <div>Пользователь: {$userSession.name}</div>

    <div class="wait-button">
        <WaitButton
            title="Отправить"
            enabled={message.length > 0 && sendButtonEnabled}
            sendAction={action}
        />
    </div>
</Rectangle>
