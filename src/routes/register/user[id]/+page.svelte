<script module lang="ts">
    import type { Session, Page } from "$lib/types";
    export async function preload(page: Page, _session: Session) {
        const { id } = page.params;
        return { id };
    }
</script>

<script lang="ts">
    import Frame from "$lib/components/Frame.svelte";
    const title = "Регистрация окончена";
    interface Props {
        id: number;
    }

    let { id }: Props = $props();
</script>

<Frame {title}>
    <h2>Ваш ИД: {id}</h2>

    <p>Используйте его совместно с вашим паролем, чтобы входить на сайт.</p>
    Если вы потеряете ИД или пароль, то не сможете их восстановить, и вам придётся
    регистрироваться заново.
    <p><a href="signin">Войти</a></p>
</Frame>
