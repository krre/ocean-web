<script lang="ts">
    import { LikeAction, LikeSelection } from "$lib/types";
    import * as route from "$lib/route";
    import * as bbcode from "$lib/bbcode";
    import * as api from "$lib/api";
    import { userSession } from "$lib/stores";
    import { isAnonymAllowed } from "$lib/utils";
    import Rectangle from "$lib/components/Rectangle.svelte";
    import PostTitle from "$lib/components/PostTitle.svelte";
    import MessageEditor from "$lib/components/post/MessageEditor.svelte";
    import EditComment from "./EditComment.svelte";
    import Pagination from "$lib/components/Pagination.svelte";

    interface EditedComment extends api.Comment.GetAll.Comment {
        edit?: boolean;
        remove?: boolean;
        likeUsers?: api.Like.GetUsers.Response[];
    }

    interface Props {
        mandelaId: number;
        comments?: EditedComment[];
        pageNo?: number;
        commentCount?: number;
        pageLimit?: number;
        onappended: () => void;
    }

    let {
        mandelaId,
        comments = $bindable([]),
        pageNo = 1,
        commentCount = 0,
        pageLimit = 1,
        onappended,
    }: Props = $props();

    let message: string = $state("");
    let messageEditorRef: MessageEditor | undefined = $state(undefined);

    let baseRoute = $derived(route.Mandela.Id(mandelaId));

    async function append() {
        const params: api.Comment.Create.Request = {
            mandela_id: +mandelaId,
            message: message,
        };

        await api.Comment.Create.exec(params);
        onappended();
    }

    async function likeComment(row: number, action: LikeAction) {
        if (action == LikeAction.Like || action == LikeAction.Dislike) {
            const params: api.Like.Create.Request = {
                comment_id: +comments[row].id,
                action: action,
            };

            await api.Like.Create.exec(params);

            comments[row].like = action;

            if (action === LikeAction.Like) {
                comments[row].like_count += 1;
            } else if (action === LikeAction.Dislike) {
                comments[row].dislike_count += 1;
            }
        } else {
            const params: api.Like.Delete.Request = {
                comment_id: +comments[row].id,
            };

            await api.Like.Delete.exec(params);

            if (comments[row].like === LikeAction.Like) {
                comments[row].like_count -= 1;
            } else if (comments[row].like === LikeAction.Dislike) {
                comments[row].dislike_count -= 1;
            }

            comments[row].like = undefined;
        }

        comments = comments;
    }

    async function getLikeUsers(row: number) {
        const params: api.Like.GetUsers.Request = {
            comment_id: +comments[row].id,
        };

        comments[row].likeUsers = await api.Like.GetUsers.exec(params);
    }

    function openEditor(row: number) {
        comments[row].edit = true;
    }

    async function editComment(row: number, message: string) {
        const params: api.Comment.Update.Request = {
            id: +comments[row].id,
            message: message,
        };

        await api.Comment.Update.exec(params);
        comments[row].message = message;
        comments[row].edit = false;
    }

    async function deleteComment(row: number) {
        const params: api.Comment.Delete.Request = {
            id: comments[row].id,
        };

        await api.Comment.Delete.exec(params);
        comments[row].remove = false;
        comments.splice(row, 1);
    }

    function replyComment(row: number) {
        const comment = comments[row];
        messageEditorRef.appendReply(comment.user_name, comment.message);
    }
</script>

<style>
    .post {
        border-bottom: var(--border-1px);
        padding: var(--page-padding);
    }

    .post:last-child {
        border-bottom: none;
    }

    .message {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>

{#if comments.length}
    <Rectangle padding={false}>
        {#each comments as comment, i}
            <div class="post" id={comment.id.toString()}>
                <PostTitle
                    baseUrl={baseRoute}
                    {pageNo}
                    id={comment.id}
                    row={i}
                    userName={comment.user_name}
                    userId={comment.user_id}
                    date={comment.create_ts}
                    likeSelection={comment.user_id === $userSession.id ||
                    $userSession.isAnonym
                        ? LikeSelection.Disabled
                        : comment.like == null
                          ? LikeSelection.None
                          : comment.like == LikeAction.Like
                            ? LikeSelection.Like
                            : LikeSelection.Dislike}
                    likeCount={comment.like_count}
                    dislikeCount={comment.dislike_count}
                    likeQuestion={$userSession.isAdmin}
                    likeUsers={comment.likeUsers}
                    editable={comment.user_id === $userSession.id ||
                        $userSession.isAdmin}
                    removable={$userSession.id === comment.user_id ||
                        $userSession.isAdmin}
                    replyable={isAnonymAllowed()}
                    onlike={(row, action) => likeComment(row, action)}
                    ongetLikeUsers={(row) => getLikeUsers(row)}
                    onedit={(row) => openEditor(row)}
                    onremove={(row) => deleteComment(row)}
                    onreply={(row) => replyComment(row)}
                />
                <div></div>

                {#if comment.edit}
                    <EditComment
                        text={comment.message}
                        sendAction={(text: string) => editComment(i, text)}
                        oncancel={() => (comment.edit = false)}
                    />
                {:else}
                    <div class="message">
                        {@html bbcode.parse(comment.message)}
                    </div>
                {/if}
            </div>
        {/each}
    </Rectangle>

    <Pagination
        count={commentCount}
        limit={pageLimit}
        offset={pageNo}
        {baseRoute}
    />
{/if}

{#if !$userSession.isAnonym || isAnonymAllowed()}
    <MessageEditor
        bind:message
        bind:this={messageEditorRef}
        sendAction={() => append()}
    />
{/if}
