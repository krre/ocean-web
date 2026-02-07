<script lang="ts">
    import * as bbcode from "$lib/bbcode";
    import * as api from "$lib/api";
    import * as consts from "$lib/consts";
    import { LikeAction, LikeSelection } from "$lib/types";
    import { userSession } from "$lib/stores";
    import { isAnonymAllowed } from "$lib/utils";
    import PostTitle from "$lib/components/PostTitle.svelte";
    import EditComment from "$lib/components/comment/EditComment.svelte";

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    interface Props {
        post: EditedPost;
        editable?: boolean;
        row?: number;
        id?: number;
        baseUrl?: string;
        pageNo: number;
        onremove: () => void;
        onreply: (row: number) => void;
    }

    let {
        post = $bindable(),
        editable = $bindable(false),
        row = 0,
        id = 0,
        baseUrl = "",
        pageNo,
        onremove,
        onreply,
    }: Props = $props();

    let likeUsers: api.Like.GetUsers.Response[] = $state([]);

    $effect(() => {
        editable =
            $userSession.isAdmin ||
            (!$userSession.isAnonym && $userSession.id === post.user_id);
    });

    let removable = $derived(
        $userSession.isAdmin ||
            (!$userSession.isAnonym && $userSession.id === post.user_id),
    );

    async function likePost(row: number, action: LikeAction) {
        if (action == LikeAction.Like || action == LikeAction.Dislike) {
            const params: api.Like.Create.Request = {
                post_id: +post.id,
                action: action,
            };

            await api.Like.Create.exec(params);

            post.like = action;

            if (action === LikeAction.Like) {
                post.like_count += 1;
            } else if (action === LikeAction.Dislike) {
                post.dislike_count += 1;
            }
        } else {
            const params: api.Like.Delete.Request = {
                post_id: +post.id,
            };

            await api.Like.Delete.exec(params);

            if (post.like === LikeAction.Like) {
                post.like_count -= 1;
            } else if (post.like === LikeAction.Dislike) {
                post.dislike_count -= 1;
            }

            post.like = null;
        }
    }

    async function getLikeUsers(row: number) {
        const params: api.Like.GetUsers.Request = {
            post_id: id,
        };

        likeUsers = await api.Like.GetUsers.exec(params);
    }

    async function editPost(message: string) {
        const params: api.Forum.Post.Update.Request = {
            id: +post.id,
            post: message,
        };

        await api.Forum.Post.Update.exec(params);
        post.post = message;
        post.edit = false;
    }

    async function removePost() {
        const params: api.Forum.Post.Delete.Request = {
            id: +post.id,
        };
        await api.Forum.Post.Delete.exec(params);
        onremove();
    }
</script>

<style>
    .post {
        padding: var(--page-padding);
        border-bottom: var(--border-1px);
    }

    .post:last-child {
        border-bottom: none;
    }

    .text {
        white-space: pre-line;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
</style>

<div class="post">
    <PostTitle
        {id}
        {row}
        {baseUrl}
        {pageNo}
        userName={post.user_name}
        userId={post.user_id}
        date={post.create_ts}
        likeSelection={$userSession.isAnonym ||
        post.user_id === $userSession.id ||
        $userSession.code === consts.Account.Anonym
            ? LikeSelection.Disabled
            : post.like == null
              ? LikeSelection.None
              : post.like == LikeAction.Like
                ? LikeSelection.Like
                : LikeSelection.Dislike}
        likeCount={post.like_count}
        dislikeCount={post.dislike_count}
        likeQuestion={$userSession.isAdmin}
        {likeUsers}
        {editable}
        {removable}
        replyable={!$userSession.isAnonym || isAnonymAllowed()}
        onlike={(row, action) => likePost(row, action)}
        ongetLikeUsers={(row) => getLikeUsers(row)}
        onedit={() => (post.edit = true)}
        onremove={() => removePost()}
        {onreply}
    />

    {#if post.edit}
        <EditComment
            text={post.post}
            sendAction={(text: string) => editPost(text)}
            oncancel={() => (post.edit = false)}
        />
    {:else}
        <div class="text">
            {@html bbcode.parse(post.post)}
        </div>
    {/if}
</div>
