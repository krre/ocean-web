<script lang="ts">
    import { goto } from "$app/navigation";
    import { anonymSession, setSession } from "$lib/stores";
    import { logout } from "$lib/api/remote/user.remote";

    async function signout() {
        await logout();
        setSession(anonymSession());
        goto("/");
    }

    signout();
</script>
