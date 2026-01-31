<script lang="ts">
    import * as consts from "$lib/consts";
    import * as route from "$lib/route";
    import * as api from "$lib/api";
    import { goto } from "$app/navigation";
    import Frame from "$lib/components/Frame.svelte";
    import MandelaEditor from "$lib/components/MandelaEditor.svelte";

    const pageTitle = "Добавить манделу";

    export let titleMode = consts.Mandela.Title.Complex;
    export let title = "";
    export let what = "";
    export let before = "";
    export let after = "";
    let description = "";
    let categories: number[] = [];

    async function append() {
        const params: api.Mandela.Create.Request = {
            title_mode: titleMode,
            title: titleMode === consts.Mandela.Title.Simple ? title : "",
            what: titleMode === consts.Mandela.Title.Complex ? what : "",
            before: titleMode === consts.Mandela.Title.Complex ? before : "",
            after: titleMode === consts.Mandela.Title.Complex ? after : "",
            description: description,
            categories: categories,
        };

        const result = await api.Mandela.Create.exec(params);
        goto(route.Mandela.Id(result.id));
    }
</script>

<Frame title={pageTitle}>
    <MandelaEditor
        bind:titleMode
        bind:title
        bind:what
        bind:before
        bind:after
        bind:description
        bind:categories
        sendAction={append}
    />
</Frame>
