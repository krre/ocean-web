<script lang="ts">
    import * as route from "$lib/route";
    import * as types from "$lib/types";
    import * as api from "$lib/api";
    import * as consts from "$lib/consts";
    import type { PathPart } from "$lib/forum";
    import { isAnonymAllowed, userUrl } from "$lib/utils";
    import { userSession } from "$lib/stores";
    import type { ForumTopicPoll } from "$lib/types";
    import FramePage from "$lib/components/forum/main/ForumFrame.svelte";
    import PostElement from "$lib/components/forum/post/PostElement.svelte";
    import Navigator from "$lib/components/forum/main/Navigator.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import MessageEditor from "$lib/components/post/MessageEditor.svelte";
    import Check from "$lib/components/Check.svelte";
    import type { PageProps } from "./$types";
    import { invalidateAll } from "$app/navigation";

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    const { data }: PageProps = $props();

    let topicName: string = $derived(data.getAllResponse.topic_name);
    let posts: EditedPost[] = $derived(
        data.getAllResponse.posts as EditedPost[],
    );
    let poll = $derived(data.getAllResponse.poll as ForumTopicPoll[]);
    let post = $state("");
    let messageEditorRef: MessageEditor | undefined = $state(undefined);
    let pollSelectionType = $derived(data.getAllResponse.poll_selection_type);
    let isVoted = $state(false);
    let oneVote = $state(-1);
    let severalVote: number[] = $state([]);
    let editVote = $state(false);
    let voteUserVisible = $state(false);
    let voteUsers: api.Forum.Topic.GetVoteUsers.Response[];

    let postCount = $derived(data.getAllResponse.post_count);

    let categoryNav: PathPart = $derived({
        id: data.getAllResponse.category_id,
        name: data.getAllResponse.category_name,
    });

    let sectionNav: PathPart = $derived({
        id: data.getAllResponse.section_id,
        name: data.getAllResponse.section_name,
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
        invalidateAll();
    }

    async function append() {
        const params: api.Forum.Post.Create.Request = {
            topic_id: data.topicId,
            post: post,
        };

        await api.Forum.Post.Create.exec(params);
        reload();
    }

    function replyPost(row: number) {
        const post = posts[row];
        messageEditorRef?.appendReply(post.user_name, post.post);
    }

    async function castVote() {
        let votes: number[] = [];

        if (pollSelectionType === types.ForumPollAnswerSelection.One) {
            votes.push(oneVote);
        } else {
            votes = severalVote;
        }

        const params: api.Forum.Topic.Vote.Request = {
            id: data.topicId,
            votes: votes,
        };

        const result = await api.Forum.Topic.Vote.exec(params);
        poll = result.poll;
        editVote = false;
    }

    async function getVoteUsers() {
        if (!voteUserVisible) {
            const params: api.Forum.Topic.GetVoteUsers.Request = {
                id: data.topicId,
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

<Navigator category={categoryNav} section={sectionNav} />

<FramePage
    title={topicName}
    showPoll={poll && poll.length > 0}
    showContent={posts.length > 0}
>
    <div>
        {#if poll}
            {#if ($userSession.isAnonym || isVoted) && !editVote}
                <div class="poll">
                    {#each poll as answer}
                        <div>{answer.answer}:</div>
                        <div>{answer.count}</div>
                        <div>
                            {#if !$userSession.isAnonym && answer.voted}
                                <Check />
                            {/if}

                            {#if voteUserVisible}
                                {@html voteUsersForAnswer(answer.id)}
                            {/if}
                        </div>
                        <div></div>
                    {/each}
                </div>

                {#if !$userSession.isAnonym}
                    <div class="buttons">
                        <button onclick={() => (editVote = true)}
                            >Изменить выбор</button
                        >

                        {#if $userSession.isAdmin}
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

    {#each posts as post, i}
        <div id={post.id.toString()}></div>
        <PostElement
            id={post.id}
            row={i}
            baseUrl={route.Forum.Topic.Id(data.topicId)}
            pageNo={data.pageNo}
            {post}
            onremove={() => reload()}
            onreply={(row) => replyPost(row)}
        />
    {/each}
</FramePage>

<Pagination
    count={postCount}
    limit={consts.Forum.Post.PageLimit}
    offset={data.pageNo}
    baseRoute={route.Forum.Topic.Id(data.topicId)}
/>

{#if !$userSession.isAnonym || isAnonymAllowed()}
    <MessageEditor
        bind:this={messageEditorRef}
        bind:message={post}
        sendAction={() => append()}
    />
{/if}
