<script lang="ts">
    import { run } from 'svelte/legacy';

    import LinkDialog from "./LinkDialog.svelte";
    import ImageDialog from "./ImageDialog.svelte";
    import VideoDialog from "./VideoDialog.svelte";
    import SpoilerDialog from "./SpoilerDialog.svelte";
    import SmilePanel from "./SmilePanel.svelte";
    import { insertText } from "$lib/utils";
    import type { TextArea } from "$lib/types";
    import * as dialog from "$lib/dialog";
    import * as bbcode from "$lib/bbcode";

    interface Props {
        post?: string;
    }

    let { post = $bindable("") }: Props = $props();

    let areaRef: TextArea = $state();
    let isPreview = $state(false);
    let isSmilePanelActive = $state(false);

    export function appendReply(userName: string, text: string) {
        const selection = window.getSelection().toString();
        const message =
            selection && text.includes(selection) ? selection : text;
        const reply = `⁅quote="${userName}"⁆${message}⁅/quote⁆`;
        post = insertText(post, areaRef.selectionStart, reply + "\n");
        areaRef.focus();
    }

    run(() => {
        if (!post) {
            isPreview = false;
        }
    });

    function appendBold() {
        replaceSelection((str: string) => `⁅b⁆${str}⁅/b⁆`);
    }

    function appendItalic() {
        replaceSelection((str: string) => `⁅i⁆${str}⁅/i⁆`);
    }

    function appendUnderline() {
        replaceSelection((str: string) => `⁅u⁆${str}⁅/u⁆`);
    }

    function appendStrikethrough() {
        replaceSelection((str: string) => `⁅s⁆${str}⁅/s⁆`);
    }

    const replaceSelection = (handler: (str: string) => string) => {
        const start = areaRef.selectionStart;
        const end = areaRef.selectionEnd;

        const str = areaRef.value.substring(start, end);
        const result = handler(str);
        post =
            post.substring(0, start) +
            result +
            post.substring(end, post.length);
    };

    function onOkLink(link: string) {
        if (areaRef.selectionStart != areaRef.selectionEnd) {
            replaceSelection((str: string) => `⁅url="${link}"⁆${str}⁅/url⁆`);
        } else {
            post = insertText(
                post,
                areaRef.selectionStart,
                `⁅url⁆${link}⁅/url⁆`,
            );
        }
    }

    function onOkImage(link: string, width?: number) {
        const widthProp = width ? ` width="${width}"` : "";
        const htmlImage = `⁅img${widthProp}⁆${link}⁅/img⁆`;
        post = insertText(post, areaRef.selectionStart, htmlImage);
    }

    function onOkVideo(link: string) {
        const htmlVideo = `⁅youtube⁆${link}⁅/youtube⁆`;
        post = insertText(post, areaRef.selectionStart, htmlVideo);
    }

    function onOkSpoiler(description: string) {
        if (areaRef.selectionStart != areaRef.selectionEnd) {
            replaceSelection(
                (str: string) => `⁅spoiler="${description}"⁆${str}⁅/spoiler⁆`,
            );
        } else {
            post = insertText(
                post,
                areaRef.selectionStart,
                `⁅spoiler="${description}"⁆Этот текст будет скрыт⁅/spoiler⁆`,
            );
        }
    }
</script>

<style>
    .container {
        max-width: 100%;
        width: 60em;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        border-top: var(--border-1px);
        border-left: var(--border-1px);
        border-right: var(--border-1px);
        background-color: rgb(236, 238, 255);
        display: flex;
        align-items: stretch;
    }

    .area {
        margin-bottom: 0.5em;
    }

    .preview {
        margin-bottom: 1em;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
        border: var(--border-1px);
    }

    .preview-button {
        padding: 0.5em;
        border-left: var(--border-1px);
        background-color: rgb(200, 219, 255);
    }

    .preview-button:hover {
        background-color: rgb(114, 230, 218);
        cursor: pointer;
    }

    .toolbar-spacing {
        flex-grow: 1;
    }

    button {
        margin-left: 0.3em;
        margin-top: 0.3em;
        margin-bottom: 0.3em;
    }
</style>

<div class="container">
    <div class="toolbar">
        <div>
            <button onclick={appendBold}><i class="fas fa-bold"></i></button>

            <button onclick={appendItalic}><i class="fas fa-italic"></i></button>

            <button onclick={appendUnderline}
                ><i class="fas fa-underline"></i></button
            >

            <button onclick={appendStrikethrough}
                ><i class="fas fa-strikethrough"></i></button
            >

            <button onclick={() => dialog.open(LinkDialog, { onOk: onOkLink })}
                ><i class="fas fa-link"></i></button
            >

            <button
                onclick={() =>
                    dialog.open(ImageDialog, {
                        onOk: onOkImage,
                    })}><i class="fas fa-image"></i></button
            >

            <button
                onclick={() =>
                    dialog.open(VideoDialog, {
                        onOk: onOkVideo,
                    })}><i class="fab fa-youtube"></i></button
            >

            <button
                onclick={() =>
                    dialog.open(SpoilerDialog, { onOk: onOkSpoiler })}
                ><i class="fas fa-eye-slash"></i></button
            >

            <button onclick={() => (isSmilePanelActive = !isSmilePanelActive)}
                ><i class="far fa-smile"></i></button
            >
        </div>

        <div class="toolbar-spacing"></div>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="preview-button" onclick={() => (isPreview = !isPreview)}>
            {#if isPreview}Редактор{:else}Просмотр{/if}
        </div>
    </div>
    {#if isSmilePanelActive}
        <SmilePanel
            on:selected={(event) => {
                post += event.detail.smile;
            }}
        />
    {/if}

    {#if !isPreview}
        <textarea
            class="area"
            rows="10"
            bind:value={post}
            bind:this={areaRef}
></textarea>
    {:else}
        <div class="preview">
            {@html bbcode.parse(post)}
        </div>
    {/if}
</div>
