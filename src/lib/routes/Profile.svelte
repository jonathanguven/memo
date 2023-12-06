<script>
    export let userData;

    let username = '';
    let timestamp = '';

    $: if (userData) {
        username = userData.username;
        let unformatted = userData.created_at;
        let date = new Date(unformatted);
        timestamp = 'Joined ' + date.toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
        });
    }
</script>

<svelte:head>
    <title>{username}</title>
</svelte:head>
<div class="flex flex-col items-center">
    <div class="text-3xl pb-2">
        {username}
    </div>
    <div class="text-lg text-zinc-500">
        {timestamp}
    </div>
</div>
