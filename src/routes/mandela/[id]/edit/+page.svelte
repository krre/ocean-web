<script module lang="ts">
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import type { Session, Page } from "$lib/types";

    export async function preload(page: Page, session: Session) {
        const { id } = page.params;
        const params: api.Mandela.GetOne.Request = {
            id: Number(id),
        };

        const result = await api.Mandela.GetOne.exec(params);
        const mandela = result.mandela;
        const categories = result.categories;

        return { id, mandela, categories, session };
    }
</script>

<script lang="ts">
    import * as consts from "$lib/consts";
    import { goto } from "$app/navigation";
    import Frame from "$lib/components/Frame.svelte";
    import MandelaEditor from "$lib/components/MandelaEditor.svelte";

    const title = "Редактировать манделу";

    interface Props {
        id: number;
        mandela: api.Mandela.GetOne.Mandela;
        categories?: number[];
        session: Session;
    }

    let {
        id,
        mandela = $bindable(),
        categories = $bindable([]),
        session = $bindable(),
    }: Props = $props();

    async function edit() {
        const params: api.Mandela.Update.Request = {
            id: Number(id),
            title_mode: mandela.title_mode,
            title:
                mandela.title_mode === consts.Mandela.Title.Simple
                    ? mandela.title
                    : "",
            what:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.what
                    : "",
            before:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.before
                    : "",
            after:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? mandela.after
                    : "",
            description: mandela.description,
            categories: categories,
        };

        await api.Mandela.Update.exec(params);
        goto(route.Mandela.Id(id));
    }
</script>

<Frame {title}>
    <MandelaEditor
        bind:titleMode={mandela.title_mode}
        bind:title={mandela.title}
        bind:what={mandela.what}
        bind:before={mandela.before}
        bind:after={mandela.after}
        bind:description={mandela.description}
        bind:categories
        bind:user={session.user}
        sendAction={edit}
    />
</Frame>
