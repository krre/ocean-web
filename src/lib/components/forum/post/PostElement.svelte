<script lang="ts">
    import { run } from 'svelte/legacy';

    import * as bbcode from "$lib/bbcode";
    import * as api from "$lib/api";
    import * as consts from "$lib/consts";
    import { LikeAction, LikeSelection } from "$lib/types";
    import { isAnonymAllowed } from "$lib/utils";
    import type { User } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import SessionHub from "../../SessionHub.svelte";
    import PostTitle from "../../../components/PostTitle.svelte";
    import EditComment from "../../../components/comment/EditComment.svelte";

    const dispatch = createEventDispatcher();

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
    }

    let {
        post = $bindable(),
        editable = $bindable(false),
        row = 0,
        id = 0,
        baseUrl = "",
        pageNo
    }: Props = $props();

    let isAdmin = $state(false);
    let isAnonym = $state(true);
    let user: User = $state();
    let likeUsers: api.Like.GetUsers.Response[] = $state();

    run(() => {
        editable = isAdmin || (user && !isAnonym && user.id === post.user_id);
    });
    let removable = $derived(isAdmin || (user && !isAnonym && user.id === post.user_id));

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
        dispatch("removed");
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

<SessionHub bind:user bind:isAdmin bind:isAnonym />

<div class="post">
    <PostTitle
        {id}
        {row}
        {baseUrl}
        {pageNo}
        userName={post.user_name}
        userId={post.user_id}
        date={post.create_ts}
        likeSelection={!user ||
        post.user_id === user.id ||
        user.code === consts.Account.Anonym
            ? LikeSelection.Disabled
            : post.like == null
              ? LikeSelection.None
              : post.like == LikeAction.Like
                ? LikeSelection.Like
                : LikeSelection.Dislike}
        likeCount={post.like_count}
        dislikeCount={post.dislike_count}
        likeQuestion={isAdmin}
        {likeUsers}
        {editable}
        {removable}
        replyable={user !== undefined || isAnonymAllowed()}
        on:like={(event) => likePost(event.detail.row, event.detail.action)}
        on:getLikeUsers={(event) => getLikeUsers(event.detail.row)}
        on:edit={() => (post.edit = true)}
        on:remove={() => removePost()}
        on:reply
    />

    {#if post.edit}
        <EditComment
            text={post.post}
            sendAction={(text) => editPost(text)}
            on:cancel={() => (post.edit = false)}
        />
    {:else}
        <div class="text">
            {@html bbcode.parse(post.post)}
        </div>
    {/if}
</div>
