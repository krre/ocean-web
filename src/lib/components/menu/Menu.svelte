<script lang="ts">
    import { isAnonymAllowed } from "$lib/utils";
    import * as route from "$lib/route";
    import * as consts from "$lib/consts";
    import { userSession } from "$lib/stores";

    interface Props {
        [key: string]: any;
    }

    let { ...props }: Props = $props();

    const isAnonymUser = $derived($userSession.code == consts.Account.Anonym);
</script>

<style>
    a {
        color: rgb(235, 246, 255);
        font-size: 1.1em;
        padding: 0.5em;
    }

    a:hover {
        color: white;
        background-color: darkslateblue;
        text-decoration: none;
    }

    nav {
        display: flex;
    }
</style>

<nav class={props.class}>
    <a href="/">Каталог</a>
    {#if isAnonymAllowed() || !isAnonymUser}
        <a href={route.Mandela.Append}>Добавить</a>
    {/if}
    <a href={route.Search}>Поиск</a>
    <a href={route.Rating}>Рейтинг</a>
    <a href={route.Forum.Root}>Форум</a>
    <a href={route.Help}>Справка</a>
    {#if !isAnonymUser}<a href={route.Profile}>Профиль</a>{/if}
    {#if !isAnonymUser}
        <a href={route.Signout}>Выйти</a>
    {:else}
        <a href={route.Signin}>Войти</a>
        <a href={route.Register.Root}>Регистрация</a>
    {/if}
</nav>
