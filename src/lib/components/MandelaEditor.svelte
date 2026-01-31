<script lang="ts">
    import * as consts from "$lib/consts";
    import { userSession } from "$lib/stores";
    import MandelaTitle from "./MandelaTitle.svelte";
    import PostEditor from "./post/PostEditor.svelte";
    import WaitButton from "./WaitButton.svelte";

    interface Props {
        titleMode?: any;
        title?: string;
        what?: string;
        before?: string;
        after?: string;
        description?: string;
        categories?: any;
        sendAction?: any;
    }

    let {
        titleMode = $bindable(consts.Mandela.Title.Complex),
        title = $bindable(""),
        what = $bindable(""),
        before = $bindable(""),
        after = $bindable(""),
        description = $bindable(""),
        categories = $bindable([]),
        sendAction = async () => {},
    }: Props = $props();

    let buttonEnabled: boolean = $derived(
        (titleMode === consts.Mandela.Title.Simple && title.length > 0) ||
            (titleMode === consts.Mandela.Title.Complex &&
                what.length > 0 &&
                before.length > 0 &&
                after.length > 0),
    );
</script>

<style>
    .column {
        display: flex;
        gap: 0.5em;
        flex-direction: column;
    }

    .wait-button {
        margin-top: 0.5em;
    }

    .rules {
        margin-bottom: 10px;
    }

    .category {
        display: inline;
    }
</style>

<div class="rules">
    <a href="help#rules">Рекомендуемые правила оформления мандел</a>
</div>

<div class="column">
    <MandelaTitle
        bind:title
        bind:what
        bind:before
        bind:after
        bind:mode={titleMode}
    />
    Описание:
    <PostEditor bind:post={description} />
    Категории:
    <div class="category">
        {#each consts.Categories as category, i}
            <label>
                <input type="checkbox" bind:group={categories} value={i} />
                {category}
            </label>
        {/each}
    </div>
    <div>Пользователь: {$userSession.name}</div>
</div>

<div class="wait-button">
    <WaitButton title="Отправить" enabled={buttonEnabled} {sendAction} />
</div>
