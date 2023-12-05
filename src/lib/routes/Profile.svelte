<script>
    import { onMount } from "svelte";

    export let user;

    let username
    let timestamp;

    onMount(() => {
        username = user.username;
        let unformatted = user.created_at;
        let date = new Date(unformatted);
        timestamp = date.toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
        });
    })

</script>

<svelte:head>
    <title>{username}</title>
</svelte:head>
<div class="flex flex-col items-center">
    <div class="text-3xl pb-2">
        {username}
    </div>
    <div class="text-lg text-zinc-500">
         Joined {timestamp}
    </div>
</div>
