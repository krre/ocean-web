<script lang="ts">
    interface Props {
        baseRoute?: string;
        baseQuery?: any;
        limit?: number;
        count?: number;
        offset?: number;
    }

    let {
        baseRoute = "",
        baseQuery = new URLSearchParams(),
        limit = 1,
        count = 1,
        offset = 1,
    }: Props = $props();

    let pages: number[] = $state([]);
    let last = $derived(Math.ceil(count / limit));

    function query(page: number, qry?: URLSearchParams): URLSearchParams {
        let result = new URLSearchParams(qry);

        result.append("page", page.toString());
        return result;
    }

    function makeLink(page: number, qry: URLSearchParams): string {
        let params = query(page, qry).toString();
        return baseRoute + (params ? "?" + params : "");
    }

    $effect(() => {
        const maxPageSelectors = 5;
        const newPages = Array(Math.min(last, maxPageSelectors));

        newPages[0] = 1;
        newPages[newPages.length - 1] = last;

        let start = 2;

        if (newPages.length == maxPageSelectors && offset >= 4) {
            if (last - offset <= 3 && offset > last - 3) {
                start = last - 3;
            } else if (offset >= 4) {
                start = offset - 1;
            }
        }

        for (let i = 0; i < newPages.length - 2; i++) {
            newPages[i + 1] = start + i;
        }

        pages = newPages;
    });
</script>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-bottom: var(--page-margin);
    }

    a {
        width: 2em;
        padding: 0.7em;
        border-top: var(--border-1px);
        border-bottom: var(--border-1px);
        border-left: var(--border-1px);
    }

    a:last-child {
        border-right: var(--border-1px);
    }

    .offset {
        background-color: powderblue;
    }
</style>

{#if count > limit}
    <div class="container">
        {#each pages as page}
            <a class:offset={offset == page} href={makeLink(page, baseQuery)}
                >{page}</a
            >
        {/each}
    </div>
{/if}
