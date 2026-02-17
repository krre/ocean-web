<script lang="ts">
    import { userUrl, dateUrl } from "$lib/utils";
    import { LikeSelection, LikeAction } from "$lib/types";
    import type * as api from "$lib/api";

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
        ongetLikeUsers?: (row: number) => void;
        onlike?: (row: number, action: LikeAction) => void;
        onedit?: (row: number) => void;
        onremove?: (row: number) => void;
        onreply?: (row: number) => void;
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
        likeUsers = [],
        likable = true,
        editable = false,
        removable = false,
        replyable = true,
        ongetLikeUsers,
        onlike,
        onedit,
        onremove,
        onreply,
    }: Props = $props();

    let likeUsersVisible = $state(false);

    function showLikeUsers() {
        if (!likeUsersVisible) {
            ongetLikeUsers?.(row);
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
        onlike?.(row, action);
    }

    function edit() {
        onedit?.(row);
    }

    function remove() {
        if (!confirm("Удалить сообщение?")) return;
        onremove?.(row);
    }

    function reply() {
        onreply?.(row);
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

    .like-button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: inherit;
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
                    }}
                    title="Нравится"><i class="far fa-thumbs-up"></i></button
                >
            {:else}
                <button
                    class="like-button"
                    aria-label="Нравится"
                    onclick={() => {
                        likeSelection == LikeSelection.Like
                            ? like(LikeAction.Unlike)
                            : {};
                    }}
                >
                    <i
                        class="far fa-thumbs-up {likeSelection ==
                        LikeSelection.Like
                            ? 'like up'
                            : ''}"
                    ></i>
                </button>
            {/if}

            <span class={likeCount ? "up" : ""}>{likeCount}</span>

            {#if likeUsersVisible && likeCount}
                {@html usersForAction(likeUsers, LikeAction.Like)}
            {/if}

            {#if likeSelection == LikeSelection.None}
                <button
                    onclick={() => {
                        like(LikeAction.Dislike);
                    }}
                    title="Не нравится"
                    ><i class="far fa-thumbs-down"></i></button
                >
            {:else}
                &nbsp;
                <button
                    class="like-button"
                    aria-label="Не нравится"
                    onclick={() => {
                        likeSelection == LikeSelection.Dislike
                            ? like(LikeAction.Unlike)
                            : {};
                    }}
                >
                    <i
                        class="far fa-thumbs-down {likeSelection ==
                        LikeSelection.Dislike
                            ? 'like down'
                            : ''}"
                    ></i>
                </button>
            {/if}

            <span class={dislikeCount ? "down" : ""}>{dislikeCount}</span>

            {#if likeUsersVisible && dislikeCount}
                {@html usersForAction(likeUsers, LikeAction.Dislike)}
            {/if}

            {#if likeQuestion && (likeCount || dislikeCount)}
                <button
                    onclick={() => {
                        showLikeUsers();
                    }}
                    title="Пользователи, поставившие оценку"
                    ><i class="fas fa-question"></i></button
                >
            {/if}

            ·
        {/if}

        {#if editable}
            <button onclick={edit} title="Редактировать"
                ><i class="fas fa-edit"></i></button
            >
        {/if}

        {#if removable}
            <button onclick={remove} title="Удалить"
                ><i class="fas fa-trash-alt"></i></button
            >
        {/if}

        {#if replyable}
            <button onclick={reply} title="Ответить"
                ><i class="fas fa-reply"></i></button
            >
        {/if}
    </span>
</div>
