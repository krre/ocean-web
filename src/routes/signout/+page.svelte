<script lang="ts">
    import { goto } from "$app/navigation";
    import { anonymSession, setSession, userSession } from "$lib/stores";
    import { logout } from "$lib/api/remote/user.remote";

    async function signout() {
        await logout($userSession.token);
        setSession(anonymSession());
        goto("/");
    }

    signout();
</script>
