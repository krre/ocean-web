<script lang="ts">
    import { run } from 'svelte/legacy';

    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as dialog from "$lib/dialog";
    import * as api from "$lib/api";
    import * as types from "$lib/types";
    import type { User } from "$lib/types";
    import { formatDateTime, userUrl, dateUrl } from "$lib/utils";
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import SessionHub from "../../SessionHub.svelte";

    const dispatch = createEventDispatcher();

    interface Props {
        topic: api.Forum.Topic.GetAll.Topic;
        editable?: boolean;
    }

    let { topic, editable = $bindable(false) }: Props = $props();

    let isAdmin = $state(false);
    let isAnonym = $state(true);
    let user: User = $state();

    run(() => {
        editable = isAdmin || (user && user.id === topic.user_id && !isAnonym);
    });

    function editTopic() {
        goto(route.Forum.Topic.Edit(topic.id));
    }

    async function removeTopic() {
        if (!dialog.remove("Удалить тему?")) return;

        const params: api.Forum.Topic.Delete.Request = {
            id: +topic.id,
        };
        await api.Forum.Topic.Delete.exec(params);
        dispatch("removed");
    }
</script>

<style>
    .topic {
        padding: var(--page-padding);
        border-bottom: var(--border-1px);
    }

    .topic:last-child {
        border-bottom: none;
    }

    .info {
        margin-top: 0.5em;
        color: rgb(90, 90, 90);
    }

    button {
        margin-left: 0.2em;
        color: gray;
    }
</style>

<SessionHub bind:user bind:isAdmin bind:isAnonym />

<div class="topic">
    <a href={route.Forum.Topic.Id(topic.id)}>
        {#if topic.type == types.ForumTopicType.Poll}
            <i class="fas fa-poll"></i>
        {/if}
        {topic.name}</a
    >
    {#if editable}
        <span>
            <button onclick={editTopic}><i class="fas fa-edit"></i></button>
            <button onclick={removeTopic}
                ><i class="fas fa-trash-alt"></i></button
            >
        </span>
    {/if}
    <div class="info">
        {@html userUrl(topic.user_name, topic.user_id)} · {formatDateTime(
            topic.create_ts,
        )}
    </div>
    <div class="info">
        Постов: {topic.post_count} · Последний:
        {#if topic.last_post_create_ts}
            {@html dateUrl(
                route.Forum.Topic.Id(topic.id),
                topic.last_post_create_ts,
                topic.last_post_id,
                Math.ceil(topic.post_count / consts.Forum.Post.PageLimit),
            )}
        {/if}
    </div>
</div>
