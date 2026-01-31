<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { userUrl, dateUrl } from "$lib/utils";
    import { LikeSelection, LikeAction } from "$lib/types";
    import * as dialog from "$lib/dialog";
    import type * as api from "$lib/api";

    const dispatch = createEventDispatcher();




    interface Props {
        baseUrl: string;
        pageNo: number;
        id: number;
        userName: string;
        userId: number;
        date: Date;
        row?: number;
        likeCount?: number;
        dislikeCount?: number;
        likeSelection?: LikeSelection;
        likeQuestion?: boolean;
        likeUsers?: api.Like.GetUsers.Response[];
        likable?: boolean;
        editable?: boolean;
        removable?: boolean;
        replyable?: boolean;
    }

    let {
        baseUrl,
        pageNo,
        id,
        userName,
        userId,
        date,
        row = 0,
        likeCount = 0,
        dislikeCount = 0,
        likeSelection = LikeSelection.None,
        likeQuestion = false,
        likeUsers = null,
        likable = true,
        editable = false,
        removable = false,
        replyable = true
    }: Props = $props();

    let likeUsersVisible = $state(false);

    function showLikeUsers() {
        if (!likeUsersVisible) {
            dispatch("getLikeUsers", {
                row: row,
            });
        }

        likeUsersVisible = !likeUsersVisible;
    }

    function usersForAction(
        users: api.Like.GetUsers.Response[],
        action: LikeAction,
    ): string {
        let result = "";

        if (!users) return result;

        for (const user of users) {
            if (user.action !== action) continue;
            result += userUrl(user.name, user.id) + ", ";
        }

        if (result) {
            result = result.slice(0, result.length - 2);
        }

        return result;
    }

    function like(action: LikeAction) {
        dispatch("like", {
            row: row,
            action: action,
        });
    }

    function edit() {
        dispatch("edit", {
            row: row,
        });
    }

    function remove() {
        if (!dialog.remove("Удалить сообщение?")) return;

        dispatch("remove", {
            row: row,
        });
    }

    function reply() {
        dispatch("reply", {
            row: row,
        });
    }
</script>

<style>
    .title {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        color: gray;
        margin-bottom: 1em;
        align-items: center;
    }

    .like {
        cursor: pointer;
    }

    .up {
        color: #093;
    }

    .down {
        color: red;
    }

    button {
        color: gray;
        margin-left: 0.2em;
    }
</style>

<div class="title">
    {@html userUrl(userName, userId)} · {@html dateUrl(
        baseUrl,
        date,
        id,
        pageNo,
    )}

    {#if likable}
        ·
    {/if}

    <span>
        {#if likable}
            {#if likeSelection == LikeSelection.None}
                <button
                    onclick={() => {
                        like(LikeAction.Like);
                    }}><i class="far fa-thumbs-up"></i></button
                >
            {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <i
                    class="far fa-thumbs-up {likeSelection == LikeSelection.Like
                        ? 'like up'
                        : ''}"
                    onclick={() => {
                        likeSelection == LikeSelection.Like
                            ? like(LikeAction.Unlike)
                            : {};
                    }}
></i>
            {/if}

            <span class={likeCount ? "up" : ""}>{likeCount}</span>

            {#if likeUsersVisible && likeCount}
                {@html usersForAction(likeUsers, LikeAction.Like)}
            {/if}

            {#if likeSelection == LikeSelection.None}
                <button
                    onclick={() => {
                        like(LikeAction.Dislike);
                    }}><i class="far fa-thumbs-down"></i></button
                >
            {:else}
                &nbsp;
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <i
                    class="far fa-thumbs-down {likeSelection ==
                    LikeSelection.Dislike
                        ? 'like down'
                        : ''}"
                    onclick={() => {
                        likeSelection == LikeSelection.Dislike
                            ? like(LikeAction.Unlike)
                            : {};
                    }}
></i>
            {/if}

            <span class={dislikeCount ? "down" : ""}>{dislikeCount}</span>

            {#if likeUsersVisible && dislikeCount}
                {@html usersForAction(likeUsers, LikeAction.Dislike)}
            {/if}

            {#if likeQuestion && (likeCount || dislikeCount)}
                <button
                    onclick={() => {
                        showLikeUsers();
                    }}><i class="fas fa-question"></i></button
                >
            {/if}

            ·
        {/if}

        {#if editable}
            <button onclick={edit}><i class="fas fa-edit"></i></button>
        {/if}

        {#if removable}
            <button onclick={remove}><i class="fas fa-trash-alt"></i></button>
        {/if}

        {#if replyable}
            <button onclick={reply}><i class="fas fa-reply"></i></button>
        {/if}
    </span>
</div>
