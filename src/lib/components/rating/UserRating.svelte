<script lang="ts">
    import { userUrl } from "$lib/utils";
    import * as api from "$lib/api";

    interface Props {
        pageNo?: number;
        pageLimit?: number;
        users?: api.Rating.GetUsers.User[];
    }

    let { pageNo = 1, pageLimit = 1, users = [] }: Props = $props();
</script>

<p>Количество мандел, добавленных пользователями.</p>

{#each users as user, i}
    {i + 1 + (pageNo - 1) * pageLimit}.
    {@html userUrl(user.name, user.id)}
    -
    {user.count}
    <br />
{/each}
