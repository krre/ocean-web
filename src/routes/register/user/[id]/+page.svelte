<script lang="ts">
    import Frame from "$lib/components/Frame.svelte";
    import type { PageProps } from "./$types";

    const title = "Регистрация окончена";

    let { data }: PageProps = $props();
</script>

<Frame {title}>
    <h2>Ваш ИД: {data.id}</h2>

    <p>Используйте его совместно с вашим паролем, чтобы входить на сайт.</p>
    Если вы потеряете ИД или пароль, то не сможете их восстановить, и вам придётся
    регистрироваться заново.
    <p><a href="/signin">Войти</a></p>
</Frame>
