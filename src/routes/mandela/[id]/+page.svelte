<script lang="ts">
    import * as consts from "$lib/consts";
    import * as bbcode from "$lib/bbcode";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import * as comment from "$lib/api/remote/comment.remote";
    import type { PageProps } from "./$types";
    import { loadComments } from "$lib/comments";
    import { userSession } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { formatDateTime, userUrl } from "$lib/utils";
    import Comment from "$lib/components/comment/Comment.svelte";
    import Frame from "$lib/components/Frame.svelte";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import WaitButton from "$lib/components/WaitButton.svelte";
    import ClipboardButton from "$lib/components/ClipboardButton.svelte";
    import Check from "$lib/components/Check.svelte";

    let { data }: PageProps = $props();

    let voteUsers: api.Mandela.GetVoteUsers.Response[];

    let voteValue = $state(-1);
    let editVote = $state(false);
    let voteUserVisible = $state(false);
    let comments: api.Comment.GetAll.Comment[] = $state([]);

    let mandela = $derived(data.getOneResponse.mandela);
    let id = $derived(mandela.id);
    let categories = $derived(data.getOneResponse.categories);
    let vote = $derived(data.getOneResponse.vote);
    let votes = $derived(data.getOneResponse.votes);
    let htmlUrl = $derived(`<a href="${data.url}">Океан. Мандела №${id}</a>`);
    let bbCodeUrl = $derived(`⁅url="${data.url}"⁆Мандела №${id}⁅/url⁆`);
    let title = $derived(
        mandela.title_mode === consts.Mandela.Title.Simple
            ? mandela.title
            : mandela.what,
    );
    let automaticTrash = $derived(data.automaticTrash);
    let totalVotes = $derived(
        votes ? votes.reduce((sum, v) => sum + v.count, 0) : 0,
    );

    $effect(() => {
        comments = data.commentGetAllResponse.comments;
    });

    function edit() {
        goto(route.Mandela.Edit(id));
    }

    async function remove() {
        if (!confirm("Удалить манделу?")) return;

        const params: api.Mandela.Delete.Request = {
            id: [id],
        };

        await api.Mandela.Delete.exec(params, $userSession.token);

        alert("Мандела удалена!");
    }

    async function castVote() {
        const params: api.Mandela.Vote.Request = {
            id: mandela.id,
            vote: voteValue,
        };

        votes = await api.Mandela.Vote.exec(params, $userSession.token);
        vote = voteValue;
        editVote = false;
    }

    async function getVoteUsers() {
        if (!voteUserVisible) {
            const params: api.Mandela.GetVoteUsers.Request = {
                id: mandela.id,
            };

            voteUsers = await api.Mandela.GetVoteUsers.exec(
                params,
                $userSession.token,
            );
        }

        voteUserVisible = !voteUserVisible;
    }

    function voteUsersForVote(vote: number): string {
        let result = "";

        for (const voteUser of voteUsers) {
            if (voteUser.vote !== vote) continue;
            result += userUrl(voteUser.name, voteUser.id) + ", ";
        }

        if (result) {
            result = result.slice(0, result.length - 2);
        }

        return result;
    }

    async function updateTrash(trash: boolean) {
        if (!confirm("Переместить манделу?")) return;

        const params: api.Mandela.UpdateTrash.Request = {
            id: mandela.id,
            trash: trash,
            automatic_trash: automaticTrash,
        };

        await api.Mandela.UpdateTrash.exec(params, $userSession.token);
    }

    async function updateAutmaticTrash() {
        const params: api.Mandela.UpdateTrash.Request = {
            id: mandela.id,
            trash: mandela.trash,
            automatic_trash: automaticTrash,
        };

        await api.Mandela.UpdateTrash.exec(params, $userSession.token);
    }

    function getVoteCount(vote: number) {
        if (votes) {
            for (let v of votes) {
                if (v.vote === vote) {
                    return v.count;
                }
            }
        }

        return 0;
    }

    async function reloadComments() {
        comments = (
            await comment.getAll({
                mandelaId: id,
                pageNo: data.pageNo,
                token: $userSession.token,
            })
        ).comments;
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    .grid {
        display: grid;
        grid-template-columns: max-content auto;
        column-gap: 0.5em;
    }

    .message {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    .trash {
        color: red;
        margin: 0;
    }

    .buttons {
        display: flex;
        gap: 0.5em;
    }

    .vote {
        display: block;
    }

    h2 {
        margin-left: 1rem;
    }

    .mandela-link-grid {
        margin-top: 0.7em;
        width: min(40em, 100%);
        display: grid;
        gap: 0.5em;
        grid-template-columns: 1fr auto;
    }
</style>

<Frame {title}>
    <div class="container">
        {#if mandela.trash}
            <h3 class="trash">Мандела находится в хламе!</h3>
        {/if}

        <div class="grid">
            <div>ИД:</div>
            <div>{mandela.id}</div>
            <div>Добавлено:</div>
            <div>{@html userUrl(mandela.user_name, mandela.user_id)}</div>
            <div>Создано:</div>
            <div>{formatDateTime(mandela.create_ts)}</div>

            {#if mandela.create_ts !== mandela.update_ts}
                <div>Изменено:</div>
                <div>{formatDateTime(mandela.update_ts)}</div>
            {/if}
            {#if mandela.mark_ts}
                <div>Просмотрено:</div>
                <div>{formatDateTime(mandela.mark_ts)}</div>
            {/if}
        </div>

        {#if mandela.title_mode === consts.Mandela.Title.Complex}
            <div class="grid">
                <div>Было:</div>
                <div>{mandela.before}</div>
                <div>Стало:</div>
                <div>{mandela.after}</div>
            </div>
        {/if}

        {#if mandela.description}
            <div class="message">
                {@html bbcode.parse(mandela.description)}
            </div>
        {/if}

        {#if categories.length}
            <div>
                Категории:
                {#each categories as category}{consts.Categories[
                        category
                    ]}&nbsp;{/each}
            </div>
        {/if}

        {#if !$userSession.isAnonym && ($userSession.id === mandela.user_id || $userSession.isAdmin)}
            <div class="buttons">
                {#if $userSession.id === mandela.user_id || $userSession.isAdmin}
                    <button onclick={edit}>Редактировать</button>
                {/if}

                {#if $userSession.isAdmin}
                    <button onclick={remove}>Удалить</button>
                    {#if mandela.trash}
                        <button onclick={() => updateTrash(false)}
                            >Переместить в каталог</button
                        >
                    {:else}
                        <button onclick={() => updateTrash(true)}
                            >Переместить в хлам</button
                        >
                    {/if}
                {/if}
            </div>
        {/if}

        {#if $userSession.isAdmin}
            <label>
                <input
                    type="checkbox"
                    bind:checked={automaticTrash}
                    onchange={(_) => updateAutmaticTrash()}
                />
                Автоматическое управление хламом
            </label>
        {/if}

        <details>
            <summary>Ссылка на манделу</summary>
            <div class="mandela-link-grid">
                <input readonly value={data.url} />
                <ClipboardButton text={data.url} />
                <input readonly value={htmlUrl} />
                <ClipboardButton text={htmlUrl} />
                <input readonly value={bbCodeUrl} />
                <ClipboardButton text={bbCodeUrl} />
            </div>
        </details>
    </div></Frame
>

<Rectangle>
    <div class="container">
        {#if $userSession.isAnonym || (vote != null && !editVote)}
            <div>Результаты опроса ({totalVotes})</div>
            <div class="grid" style="margin-left: 1em">
                {#each consts.Votes as voteName, i}
                    <div>{voteName}:</div>
                    <div>
                        {getVoteCount(i)}
                        {#if !$userSession.isAnonym && vote == i}
                            <Check />
                        {/if}

                        {#if voteUserVisible}
                            {@html voteUsersForVote(i)}
                        {/if}
                    </div>
                {/each}
            </div>

            {#if !$userSession.isAnonym}
                <div class="buttons">
                    <button onclick={() => (editVote = true)}
                        >Изменить выбор</button
                    >

                    {#if $userSession.isAdmin}
                        <button onclick={getVoteUsers}
                            >{voteUserVisible ? "Скрыть" : "Показать"}</button
                        >
                    {/if}
                </div>
            {:else}Голосовать могут только зарегистрированные пользователи.{/if}
        {:else}
            <div>Является ли для вас это манделой?</div>
            <div>
                {#each consts.Votes as voteName, i}
                    <label class="vote">
                        <input type="radio" bind:group={voteValue} value={i} />
                        {voteName}
                    </label>
                {/each}
            </div>

            <div>
                <WaitButton
                    title="Проголосовать"
                    enabled={voteValue >= 0}
                    sendAction={castVote}
                />
            </div>
        {/if}
    </div>
</Rectangle>

<h2>Комментарии</h2>

<div class="comment">
    <Comment
        bind:comments
        pageNo={data.pageNo}
        mandelaId={id}
        pageLimit={consts.Mandela.Comment.PageLimit}
        commentCount={data.commentGetAllResponse.total_count}
        onappended={() => reloadComments()}
    />
</div>
