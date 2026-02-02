<script lang="ts">
    import * as consts from "$lib/consts";
    import * as api from "$lib/api";
    import * as route from "$lib/route";
    import type { PageProps } from "./$types";
    import { goto } from "$app/navigation";
    import Frame from "$lib/components/Frame.svelte";
    import MandelaEditor from "$lib/components/MandelaEditor.svelte";

    const title = "Редактировать манделу";

    let { data }: PageProps = $props();
    let id = $derived(data.mandela.id);
    let mandela = $derived(data.mandela);

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
            categories: data.categories,
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
        bind:categories={data.categories}
        sendAction={edit}
    />
</Frame>
