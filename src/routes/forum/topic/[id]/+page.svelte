<script module lang="ts">
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    const PAGE_LIMIT = consts.Forum.Post.PageLimit;

    export async function preload(page: Page, _session: Session) {
        const topicId = +page.params.id;
        const pageNo = +page.query.page || 1;
        const getAllResponse = await load(topicId, pageNo);
        return { getAllResponse, pageNo, topicId };
    }

    async function load(
        topicId: number,
        pageNo: number,
    ): Promise<api.Forum.Post.GetAll.Response> {
        const params: api.Forum.Post.GetAll.Request = {
            topic_id: topicId,
            offset: (pageNo - 1) * PAGE_LIMIT,
            limit: PAGE_LIMIT,
        };

        return await api.Forum.Post.GetAll.exec(params);
    }
</script>

<script lang="ts">
    import * as route from "$lib/route";
    import * as consts from "$lib/consts";
    import * as types from "$lib/types";
    import type { PathPart } from "$lib/forum";
    import { isAnonymAllowed, userUrl } from "$lib/utils";
    import type { User, ForumTopicPoll } from "$lib/types";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import SessionHub from "$lib/components/SessionHub.svelte";
    import PostElement from "$lib/components/forum/post/PostElement.svelte";
    import Navigator from "$lib/components/forum/main/Navigator.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import MessageEditor from "$lib/components/post/MessageEditor.svelte";
    import Check from "$lib/components/Check.svelte";

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    interface Props {
        getAllResponse: api.Forum.Post.GetAll.Response;
        topicId?: number;
        pageNo?: number;
    }

    let {
        getAllResponse = $bindable(),
        topicId = 0,
        pageNo = 1,
    }: Props = $props();

    let topicName: string = $state();
    let isAdmin = $state(false);
    let isAnonym = $state(true);
    let user: User = $state();
    let posts: EditedPost[] = $state([]);
    let post = $state("");
    let messageEditorRef: MessageEditor = $state();
    let pollSelectionType: types.ForumPollAnswerSelection = $state();
    let poll: ForumTopicPoll[] = $state();
    let isVoted = $state(false);
    let oneVote = $state(-1);
    let severalVote: number[] = $state([]);
    let editVote = $state(false);
    let voteUserVisible = $state(false);
    let voteUsers: api.Forum.Topic.GetVoteUsers.Response[];

    let postCount = $state(0);

    let categoryNav: PathPart = $state();
    let sectionNav: PathPart = $state();

    $effect(() => {
        topicName = getAllResponse.topic_name;
        postCount = getAllResponse.post_count;
        posts = getAllResponse.posts as EditedPost[];
        poll = getAllResponse.poll;
        pollSelectionType = getAllResponse.poll_selection_type;

        categoryNav = {
            id: getAllResponse.category_id,
            name: getAllResponse.category_name,
        };

        sectionNav = {
            id: getAllResponse.section_id,
            name: getAllResponse.section_name,
        };
    });

    $effect(() => {
        if (poll) {
            for (const answer of poll) {
                if (answer.voted) {
                    isVoted = true;
                    break;
                }
            }
        }
    });

    async function reload() {
        getAllResponse = await load(topicId, pageNo);
    }

    async function append() {
        const params: api.Forum.Post.Create.Request = {
            topic_id: topicId,
            post: post,
        };

        await api.Forum.Post.Create.exec(params);
        reload();
    }

    function replyPost(row: number) {
        const post = posts[row];
        messageEditorRef.appendReply(post.user_name, post.post);
    }

    async function castVote() {
        let votes: number[] = [];

        if (pollSelectionType === types.ForumPollAnswerSelection.One) {
            votes.push(oneVote);
        } else {
            votes = severalVote;
        }

        const params: api.Forum.Topic.Vote.Request = {
            id: topicId,
            votes: votes,
        };

        const result = await api.Forum.Topic.Vote.exec(params);
        poll = result.poll;
        editVote = false;
    }

    async function getVoteUsers() {
        if (!voteUserVisible) {
            const params: api.Forum.Topic.GetVoteUsers.Request = {
                id: topicId,
            };

            voteUsers = await api.Forum.Topic.GetVoteUsers.exec(params);
        }

        voteUserVisible = !voteUserVisible;
    }

    function voteUsersForAnswer(answerId: number): string {
        let result = "";

        for (const voteUser of voteUsers) {
            if (voteUser.answer_id !== answerId) continue;
            result += userUrl(voteUser.name, voteUser.id) + ", ";
        }

        if (result) {
            result = result.slice(0, result.length - 2);
        }

        return result;
    }
</script>

<style>
    button {
        margin-top: 0.5em;
    }

    .poll {
        display: grid;
        grid-template-columns: auto auto auto 1fr;
        gap: 0.5em;
    }

    .vote {
        display: block;
    }

    .buttons {
        display: flex;
        gap: 0.5em;
    }
</style>

<SessionHub bind:user bind:isAdmin bind:isAnonym />
<Navigator category={categoryNav} section={sectionNav} />

<FramePage
    title={topicName}
    showPoll={poll && poll.length > 0}
    showContent={posts.length > 0}
>
    {#snippet poll()}
        <div>
            {#if poll}
                {#if (isAnonym || isVoted) && !editVote}
                    <div class="poll">
                        {#each poll as answer}
                            <div>{answer.answer}:</div>
                            <div>{answer.count}</div>
                            <div>
                                {#if !isAnonym && answer.voted}
                                    <Check />
                                {/if}

                                {#if voteUserVisible}
                                    {@html voteUsersForAnswer(answer.id)}
                                {/if}
                            </div>
                            <div></div>
                        {/each}
                    </div>

                    {#if !isAnonym}
                        <div class="buttons">
                            <button onclick={() => (editVote = true)}
                                >Изменить выбор</button
                            >

                            {#if isAdmin}
                                <button onclick={getVoteUsers}
                                    >{voteUserVisible
                                        ? "Скрыть"
                                        : "Показать"}</button
                                >
                            {/if}
                        </div>
                    {:else}
                        <br />
                        Голосовать могут только зарегистрированные пользователи.
                    {/if}
                {:else}
                    {#each poll as answer}
                        {#if pollSelectionType === types.ForumPollAnswerSelection.One}
                            <label class="vote">
                                <input
                                    type="radio"
                                    bind:group={oneVote}
                                    value={answer.id}
                                />
                                {answer.answer}
                            </label>
                        {:else}
                            <label class="vote">
                                <input
                                    type="checkbox"
                                    bind:group={severalVote}
                                    value={answer.id}
                                />
                                {answer.answer}
                            </label>
                        {/if}
                    {/each}

                    <div style="margin: 0.5em"></div>

                    <button
                        onclick={castVote}
                        disabled={pollSelectionType ==
                        types.ForumPollAnswerSelection.One
                            ? oneVote < 0
                            : severalVote.length == 0}>Выбрать</button
                    >
                {/if}
            {/if}
        </div>
    {/snippet}

    {#each posts as post, i}
        <div id={post.id.toString()}></div>
        <PostElement
            id={post.id}
            row={i}
            baseUrl={route.Forum.Topic.Id(topicId)}
            {pageNo}
            {post}
            on:removed={() => reload()}
            on:reply={(event) => replyPost(event.detail.row)}
        />
    {/each}
</FramePage>

<Pagination
    count={postCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Forum.Topic.Id(topicId)}
/>

{#if user !== undefined || isAnonymAllowed()}
    <MessageEditor
        bind:this={messageEditorRef}
        bind:message={post}
        sendAction={() => append()}
    />
{/if}
