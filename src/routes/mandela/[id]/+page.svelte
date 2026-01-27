<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(page: Page, session: Session) {
        const url = "https://" + page.host + page.path;
        const mandelaId = +page.params.id;
        const pageNo = +page.query.page || 1;

        const getOneResponse = await api.Mandela.GetOne.exec({
            id: mandelaId,
        });

        const automaticTrash = getOneResponse.mandela.automatic_trash;

        if (session.user && !getOneResponse.mandela.mark_ts) {
            await api.Mandela.Mark.exec({ id: getOneResponse.mandela.id });
        }

        const commentGetAllResponse = await loadComments(mandelaId, pageNo);

        return {
            getOneResponse,
            commentGetAllResponse,
            url,
            pageNo,
            automaticTrash,
        };
    }

    function loadComments(
        mandelaId: number,
        pageNo: number,
    ): Promise<api.Comment.GetAll.Response> {
        const params: api.Comment.GetAll.Request = {
            mandela_id: mandelaId,
            limit: consts.Mandela.Comment.PageLimit,
            offset: (pageNo - 1) * consts.Mandela.Comment.PageLimit,
        };

        return api.Comment.GetAll.exec(params);
    }
</script>

<script lang="ts">
    import * as consts from "$lib/consts";
    import * as bbcode from "$lib/bbcode";
    import * as dialog from "$lib/dialog";
    import * as route from "$lib/route";
    import type { User } from "$lib/types";
    import { goto } from "$app/navigation";
    import { formatDateTime, userUrl } from "$lib/utils";
    import Comment from "../../../components/comment/Comment.svelte";
    import Frame from "../../../components/Frame.svelte";
    import SessionHub from "../../../components/SessionHub.svelte";
    import Rectangle from "../../../components/Rectangle.svelte";
    import WaitButton from "../../../components/WaitButton.svelte";
    import Check from "../../../components/Check.svelte";

    interface Props {
        getOneResponse: api.Mandela.GetOne.Response;
        commentGetAllResponse: api.Comment.GetAll.Response;
        url: string;
        pageNo: number;
        automaticTrash: boolean;
    }

    let {
        getOneResponse,
        commentGetAllResponse = $bindable(),
        url,
        pageNo,
        automaticTrash = $bindable(),
    }: Props = $props();

    let totalVotes = $state(0);
    let votes: api.Mandela.Vote[] = $state();
    let voteUsers: api.Mandela.GetVoteUsers.Response[];

    let voteValue = $state(-1);
    let editVote = $state(false);
    let voteUserVisible = $state(false);

    let user: User = $state();
    let isAdmin = $state(false);
    let isAnonym = $state(true);

    let mandela = $derived(getOneResponse.mandela);
    let comments = $derived(commentGetAllResponse.comments);
    let id = $derived(mandela.id);
    let categories = $derived(getOneResponse.categories);
    let vote = $derived(getOneResponse.vote);
    let htmlUrl = $derived(`<a href="${url}">Океан. Мандела №${id}</a>`);
    let bbCodeUrl = $derived(`⁅url="${url}"⁆Мандела №${id}⁅/url⁆`);
    let title = $derived(
        mandela.title_mode === consts.Mandela.Title.Simple
            ? mandela.title
            : mandela.what,
    );

    $effect(() => {
        votes = getOneResponse.votes;
    });

    $effect(() => {
        totalVotes = 0;

        for (let v of votes) {
            totalVotes += v.count;
        }
    });

    function edit() {
        goto(route.Mandela.Edit(id));
    }

    async function remove() {
        if (!dialog.remove("Удалить манделу?")) return;

        const params: api.Mandela.Delete.Request = {
            id: [id],
        };

        await api.Mandela.Delete.exec(params);

        alert("Мандела удалена!");
    }

    async function castVote() {
        const params: api.Mandela.Vote.Request = {
            id: mandela.id,
            vote: voteValue,
        };

        votes = await api.Mandela.Vote.exec(params);
        vote = voteValue;
        editVote = false;
    }

    async function getVoteUsers() {
        if (!voteUserVisible) {
            const params: api.Mandela.GetVoteUsers.Request = {
                id: mandela.id,
            };

            voteUsers = await api.Mandela.GetVoteUsers.exec(params);
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
        if (!dialog.remove("Переместить манделу?")) return;

        const params: api.Mandela.UpdateTrash.Request = {
            id: mandela.id,
            trash: trash,
            automatic_trash: automaticTrash,
        };

        await api.Mandela.UpdateTrash.exec(params);
    }

    async function updateAutmaticTrash() {
        const params: api.Mandela.UpdateTrash.Request = {
            id: mandela.id,
            trash: mandela.trash,
            automatic_trash: automaticTrash,
        };

        await api.Mandela.UpdateTrash.exec(params);
    }

    function getVoteCount(vote: number) {
        for (let v of votes) {
            if (v.vote === vote) {
                return v.count;
            }
        }

        return 0;
    }

    function copyLink(value: string) {
        navigator.clipboard.writeText(value);
    }

    async function reloadComments() {
        commentGetAllResponse = await loadComments(id, pageNo);
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

<SessionHub bind:user bind:isAdmin bind:isAnonym />

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

        {#if !isAnonym && (user.id === mandela.user_id || isAdmin)}
            <div class="buttons">
                {#if user.id === mandela.user_id || isAdmin}
                    <button onclick={edit}>Редактировать</button>
                {/if}

                {#if isAdmin}
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

        {#if isAdmin}
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
                <input readonly value={url} />
                <button onclick={() => copyLink(url)}
                    ><i class="far fa-copy"></i></button
                >
                <input readonly value={htmlUrl} />
                <button onclick={() => copyLink(htmlUrl)}
                    ><i class="far fa-copy"></i></button
                >
                <input readonly value={bbCodeUrl} />
                <button onclick={() => copyLink(bbCodeUrl)}
                    ><i class="far fa-copy"></i></button
                >
            </div>
        </details>
    </div></Frame
>

<Rectangle>
    <div class="container">
        {#if !user || (vote != null && !editVote)}
            <div>Результаты опроса ({totalVotes})</div>
            <div class="grid" style="margin-left: 1em">
                {#each consts.Votes as voteName, i}
                    <div>{voteName}:</div>
                    <div>
                        {getVoteCount(i)}
                        {#if user && vote == i}
                            <Check />
                        {/if}

                        {#if voteUserVisible}
                            {@html voteUsersForVote(i)}
                        {/if}
                    </div>
                {/each}
            </div>

            {#if user}
                <div class="buttons">
                    <button onclick={() => (editVote = true)}
                        >Изменить выбор</button
                    >

                    {#if isAdmin}
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
        {user}
        {comments}
        {pageNo}
        mandelaId={id}
        pageLimit={consts.Mandela.Comment.PageLimit}
        commentCount={commentGetAllResponse.total_count}
        on:appended={() => reloadComments()}
    />
</div>
