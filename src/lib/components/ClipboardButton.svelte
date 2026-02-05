<script lang="ts">
    interface Props {
        text: string;
    }

    let { text }: Props = $props();
</script>

<button onclick={() => navigator.clipboard.writeText(text)} title="Копировать"
    ><i class="far fa-copy"></i></button
>
