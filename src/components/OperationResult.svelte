<script lang="ts">
    interface Props {
        success?: string;
        error?: string;
    }

    let { success, error }: Props = $props();

    $effect(() => {
        if (success) {
            error = "";
        }
    });
</script>

<style>
    .success {
        color: green;
    }

    .error {
        color: red;
    }
</style>

{#if success}
    <div class="success">{success}</div>
{/if}

{#if error}
    <div class="error">Ошибка: {error}</div>
{/if}
