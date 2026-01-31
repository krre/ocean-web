<script lang="ts">
    import * as consts from "$lib/consts";
    import type * as api from "$lib/api";
    import { formatDateTime } from "$lib/utils";

    interface Props {
        user: api.User.GetOne.Response;
    }

    let { user }: Props = $props();

    function openUrl() {
        const params = new URLSearchParams();
        params.append("user", user.id.toString());
        return "?" + params.toString();
    }
</script>

<div>Дата регистрации:</div>
<div>{formatDateTime(user.create_ts)}</div>
<div>Тип аккаунта:</div>
<div>{consts.Account.ModeNames[user.code]}</div>
<div>Мандел:</div>
<div>
    {user.mandela_count}
    <a href={openUrl()}>Показать</a>
</div>
<div>Комментариев:</div>
<div>{user.comment_count}</div>
<div>Тем на форуме:</div>
<div>{user.forum_topic_count}</div>
<div>Постов на форуме:</div>
<div>{user.forum_post_count}</div>
<div>Получено лайков:</div>
<div>{user.like_count}</div>
<div>Получено дизлайков:</div>
<div>{user.dislike_count}</div>
