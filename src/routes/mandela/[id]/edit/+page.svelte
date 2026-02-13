<script lang="ts">
    import * as consts from "$lib/consts";
    import * as api from "$lib/api";
    import * as route from "$lib/route";
    import type { PageProps } from "./$types";
    import { goto } from "$app/navigation";
    import { userSession } from "$lib/stores";
    import Frame from "$lib/components/Frame.svelte";
    import MandelaEditor from "$lib/components/MandelaEditor.svelte";

    const frameTitle = "Редактировать манделу";

    let { data }: PageProps = $props();
    let id = $derived(data.mandela.id);
    let mandela = $derived(data.mandela);

    let titleMode = $derived(mandela.title_mode);
    let title = $state("");
    let what = $state("");
    let before = $state("");
    let after = $state("");
    let description = $state("");
    let categories: number[] = $state([]);

    $effect(() => {
        title = mandela.title;
        what = mandela.what;
        before = mandela.before;
        after = mandela.after;
        description = mandela.description;
        categories = data.categories;
    });

    async function edit() {
        const params: api.Mandela.Update.Request = {
            id: Number(id),
            title_mode: mandela.title_mode,
            title:
                mandela.title_mode === consts.Mandela.Title.Simple ? title : "",
            what:
                mandela.title_mode === consts.Mandela.Title.Complex ? what : "",
            before:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? before
                    : "",
            after:
                mandela.title_mode === consts.Mandela.Title.Complex
                    ? after
                    : "",
            description: description,
            categories: categories,
        };

        await api.Mandela.Update.exec(params, $userSession.token);
        goto(route.Mandela.Id(id));
    }
</script>

<Frame title={frameTitle}>
    <MandelaEditor
        bind:titleMode
        bind:title
        bind:what
        bind:before
        bind:after
        bind:description
        bind:categories
        sendAction={edit}
    />
</Frame>
