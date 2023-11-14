<script>
    import Image from './lib/Image.svelte';
    import Message from './lib/Message.svelte'

    let msg = '';
    let img = '';

    function handleMessage(event) {
        msg = event.detail.message;
        if (event.detail.image) {
            img = event.detail.image;
        }
    }
</script>

<main>
    <h1>FlashAI</h1>

    <div class="p-4">
        <Message on:messageFetched={handleMessage} />
        <Image on:messageFetched={handleMessage} />
    </div>

    {#if msg}
        <p class="mb-4">{msg}</p>
    {/if}

    {#if img}
        <img src={img} alt="" width="400" height="400">
        <button class="mt-4" on:click={() => {img = ''}}>clear</button>
    {/if}

    
</main>

