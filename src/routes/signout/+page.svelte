<script lang="ts">
    import * as api from "$lib/api";
    import { goto } from "$app/navigation";
    import { anonymSession, setSession } from "$lib/stores";
    import { logout } from "$lib/network";

    async function signout() {
        await api.User.Logout.exec();
        logout();
        setSession(anonymSession());
        goto("/");
    }

    signout();
</script>
