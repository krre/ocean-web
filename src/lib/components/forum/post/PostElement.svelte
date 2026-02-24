<script lang="ts">
    import * as bbcode from "$lib/bbcode";
    import * as api from "$lib/api";
    import * as consts from "$lib/consts";
    import * as likeFn from "$lib/api/remote/like.remote";
    import * as postFn from "$lib/api/remote/forum/post.remote";
    import { LikeAction, LikeSelection } from "$lib/types";
    import { userSession } from "$lib/stores";
    import { isAnonymAllowed } from "$lib/utils";
    import PostTitle from "$lib/components/PostTitle.svelte";
    import EditComment from "$lib/components/comment/EditComment.svelte";

    interface Props {
        post: api.Forum.Post.GetAll.Post;
        editable?: boolean;
        row?: number;
        id?: number;
        baseUrl?: string;
        pageNo: number;
        onremove: () => void;
        onreply: (row: number) => void;
    }

    let {
        post,
        editable = $bindable(false),
        row = 0,
        id = 0,
        baseUrl = "",
        pageNo,
        onremove,
        onreply,
    }: Props = $props();

    let likeUsers: api.Like.GetUsers.Response[] = $state([]);
    let editMode = $state(false);

    let like: LikeAction | undefined = $state();
    let likeCount = $state(0);
    let dislikeCount = $state(0);

    $effect(() => {
        like = post.like;
        likeCount = post.like_count;
        dislikeCount = post.dislike_count;
    });

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
            await likeFn.create({
                post_id: post.id,
                action: action,
            });

            like = action;

            if (action === LikeAction.Like) {
                likeCount += 1;
            } else if (action === LikeAction.Dislike) {
                dislikeCount += 1;
            }
        } else {
            await likeFn.del({ post_id: post.id });

            if (like === LikeAction.Like) {
                likeCount -= 1;
            } else if (like === LikeAction.Dislike) {
                dislikeCount -= 1;
            }

            like = undefined;
        }
    }

    async function getLikeUsers(row: number) {
        likeUsers = await likeFn.getUsers({
            post_id: id,
        });
    }

    async function editPost(message: string) {
        await postFn.update({
            id: post.id,
            post: message,
        });

        post.post = message;
        editMode = false;
    }

    async function removePost() {
        await postFn.del({ id: +post.id });
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
            : like == null
              ? LikeSelection.None
              : like == LikeAction.Like
                ? LikeSelection.Like
                : LikeSelection.Dislike}
        {likeCount}
        {dislikeCount}
        likeQuestion={$userSession.isAdmin}
        {likeUsers}
        {editable}
        {removable}
        replyable={!$userSession.isAnonym || isAnonymAllowed()}
        onlike={(row, action) => likePost(row, action)}
        ongetLikeUsers={(row) => getLikeUsers(row)}
        onedit={() => {
            editMode = true;
        }}
        onremove={() => removePost()}
        {onreply}
    />

    {#if editMode}
        <EditComment
            text={post.post}
            sendAction={(text: string) => editPost(text)}
            oncancel={() => (editMode = false)}
        />
    {:else}
        <div class="text">
            {@html bbcode.parse(post.post)}
        </div>
    {/if}
</div>
