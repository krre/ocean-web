<script lang="ts">
    import { isAnonymAllowed } from "$lib/utils";
    import * as route from "$lib/route";
    import * as consts from "$lib/consts";
    import { userSession } from "$lib/stores";

    interface Props {
        class?: string;
        onclick?: () => void;
    }

    let { onclick, class: className }: Props = $props();

    const isAnonymUser = $derived($userSession.code == consts.Account.Anonym);

    const menuItems = $derived([
        { href: "/", label: "Каталог", show: true },
        {
            href: route.Mandela.Append,
            label: "Добавить",
            show: isAnonymAllowed() || !isAnonymUser,
        },
        { href: route.Search, label: "Поиск", show: true },
        { href: route.Rating, label: "Рейтинг", show: true },
        { href: route.Forum.Root, label: "Форум", show: true },
        { href: route.Help, label: "Справка", show: true },
        { href: route.Profile, label: "Профиль", show: !isAnonymUser },
        {
            href: isAnonymUser ? route.Signin : route.Signout,
            label: isAnonymUser ? "Войти" : "Выйти",
            show: true,
        },
        { href: route.Register.Root, label: "Регистрация", show: isAnonymUser },
    ]);
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

<nav class={className}>
    {#each menuItems as item}
        {#if item.show}
            <a href={item.href} {onclick}>
                {item.label}
            </a>
        {/if}
    {/each}
</nav>
