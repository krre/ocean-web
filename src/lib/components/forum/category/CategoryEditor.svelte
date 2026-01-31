<script lang="ts">
    interface Props {
        name?: string;
        order?: number;
        action?: any;
    }

    let { name = $bindable(""), order = $bindable(0), action = () => {} }: Props = $props();

    let buttonEnabled = $derived(name && order);
</script>

<style>
    .form {
        display: grid;
        grid-gap: 0.5em;
        width: 20em;
    }

    button {
        margin-top: 1em;
    }
</style>

<div class="form">
    Название:
    <input type="text" bind:value={name} />
    Порядок:
    <input type="number" bind:value={order} />
</div>

<button onclick={action} disabled={!buttonEnabled}>Отправить</button>
