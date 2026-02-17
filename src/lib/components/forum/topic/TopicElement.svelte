<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import * as types from "$lib/types";
    import { userSession } from "$lib/stores";
    import { formatDateTime, userUrl, dateUrl } from "$lib/utils";
    import { goto } from "$app/navigation";

    interface Props {
        topic: api.Forum.Topic.GetAll.Topic;
        editable?: boolean;
        onremoved: () => void;
    }

    let { topic, editable = $bindable(false), onremoved }: Props = $props();

    $effect(() => {
        editable =
            $userSession.isAdmin ||
            (!$userSession.isAnonym && $userSession.id === topic.user_id);
    });

    function editTopic() {
        goto(route.Forum.Topic.Edit(topic.id));
    }

    async function removeTopic() {
        if (!confirm("Удалить тему?")) return;

        const params: api.Forum.Topic.Delete.Request = {
            id: +topic.id,
        };
        await api.Forum.Topic.Delete.exec(params, $userSession.token);
        onremoved();
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

<div class="topic">
    <a href={route.Forum.Topic.Id(topic.id)}>
        {#if topic.type == types.ForumTopicType.Poll}
            <i class="fas fa-poll"></i>
        {/if}
        {topic.name}</a
    >
    {#if editable}
        <span>
            <button onclick={editTopic} title="Редактировать"
                ><i class="fas fa-edit"></i></button
            >
            <button onclick={removeTopic} title="Удалить"
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
        {#if topic.last_post_create_ts && topic.last_post_id}
            {@html dateUrl(
                route.Forum.Topic.Id(topic.id),
                topic.last_post_create_ts,
                topic.last_post_id,
                Math.ceil(topic.post_count / consts.Forum.Post.PageLimit),
            )}
        {/if}
    </div>
</div>
