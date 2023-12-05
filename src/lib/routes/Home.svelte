<script>
    import { fade } from 'svelte/transition'

    import Image from '../components/Image.svelte';
    import Message from '../components/Message.svelte'

    let msg = '';
    let img = '';
    let showMessage = false;

    function handleMessage(event) {
        msg = event.detail.message ? event.detail.message : '';
        if (event.detail.image) {
            img = event.detail.image;
        }
        showMessage = true;
        setTimeout(() => {
            showMessage = false;
        }, 1500);
    }
</script>

<svelte:head>
    <title>Flash</title>
</svelte:head>
<main class="flex flex-col items-center">
    <h1 class="text-3xl">Home</h1>
    <div class="mt-4 mb-2">
        <Message on:messageFetched={handleMessage} />
        <Image on:messageFetched={handleMessage} />
    </div>

    <div class="min-h-[24px] flex justify-center items-center">
        {#if showMessage}
            <p out:fade={{ duration: 500 }}>{msg}</p>
        {/if}
    </div>

    {#if img}
        <img src={img} alt="" width="400" height="400">
        <button class="rounded-lg border border-transparent bg-neutral-900 hover:text-color-neutral-500 px-5 py-2.5 text-base font-medium cursor-pointer transition-colors duration-200 my-4" on:click={() => {img = ''}}>clear</button>
    {/if}
</main>
