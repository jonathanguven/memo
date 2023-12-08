<script>
    import { onMount } from "svelte";
    import { fetchUserData } from "../api/users";

    export let username;

    let name = '';
    let timestamp = '';
    let found = false
    let loading = true

    onMount(async () => {
        const user = await fetchUserData(username);
        loading = false;
        if (user) {
            found = true;
            name = user.username;
            let unformatted = user.created_at;
            let date = new Date(unformatted);
            timestamp = 'Joined ' + date.toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
            });
        } 
    });
</script>

<svelte:head>
    <title>{username}</title>
</svelte:head>
<div class="flex flex-col items-center">
    {#if loading}
        <br>
    {:else if found}
        <div class="text-3xl pb-2">
            {name}
        </div>
        <div class="text-lg text-zinc-500">
            {timestamp}
        </div>
    {:else}
        <div class="text-3xl pb-2">Error!</div>
        <div class="text-lg text-zinc-500">
            User '{username}' Not Found
        </div>
    {/if}
</div>
