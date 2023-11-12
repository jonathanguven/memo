<script>
    import Goodbye from './lib/Goodbye.svelte';
    import Hello from './lib/Hello.svelte'

    let msg = '';

    function handleMessage(event) {
        msg = event.detail;
        console.log(msg);
    }
</script>

<main>
    <h1>FlashAI</h1>

    <div class="p-8">
        <Hello on:messageFetched={handleMessage} />
        <Goodbye on:messageFetched={handleMessage} />
    </div>
    
    {#if msg}
        <p>{msg}</p>
    {/if}

</main>

