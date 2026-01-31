<script lang="ts">
    import * as consts from "$lib/consts";
    import * as forum from "$lib/forum";
    import * as route from "$lib/route";
    import { textCut } from "$lib/utils";
    import type { NewTopic } from "$lib/forum";
    import PostTitle from "../../PostTitle.svelte";

    interface Props {
        topic: NewTopic;
    }

    let { topic }: Props = $props();
</script>

<style>
    .topic {
        padding: var(--page-padding);
        border-bottom: var(--border-1px);
    }

    .topic:last-child {
        border-bottom: none;
    }

    .post {
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    h3 {
        margin: 0 0 0.3em 0;
    }
</style>

<div class="topic">
    <a href={forum.topicLink(topic.id, topic.post_count)}
        ><h3>
            {topic.name}
        </h3></a
    >
    <PostTitle
        id={topic.post_id}
        baseUrl={route.Forum.Topic.Id(topic.id)}
        pageNo={Math.ceil(topic.post_count / consts.Forum.Post.PageLimit)}
        userName={topic.user_name}
        userId={topic.user_id}
        date={topic.post_create_ts}
        likable={false}
        replyable={false}
    />
    <div class="post">{textCut(topic.post, 300)}</div>
</div>
