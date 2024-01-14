<script>
    import { Link, navigate } from 'svelte-routing';
    import { ArrowLeftRight } from 'lucide-svelte';
    import { afterUpdate } from 'svelte';

    let front = "Optimize Your Study Habits";
    let phrase = "Flashcards are the most effective tool for studying important terms and vocabulary.\n\n";
    let backContent = "";

    for (let i = 0; i < 40; i++) {
        backContent = backContent + phrase;
    }

    let back = convertNewlinesToBreaks(backContent);
    
    let isFront = true;

    let frontElement;
    let backElement;

    function isOverflowing(element) {
        return element.scrollHeight > element.clientHeight;
    }

    function checkOverflow() {
        if (frontElement) {
            frontElement.classList.toggle('items-start', isOverflowing(frontElement));
            frontElement.classList.toggle('items-center', !isOverflowing(frontElement));
        }
        if (backElement) {
            backElement.classList.toggle('items-start', isOverflowing(backElement));
            backElement.classList.toggle('items-center', !isOverflowing(backElement));
        }
    }

    function goTo(url) {
        navigate(url)
    }

    afterUpdate(() => {
        checkOverflow();
    });

    function toggle() {
        isFront = !isFront;
    }

    function convertNewlinesToBreaks(str) {
        return str.replace(/\n/g, '<br>');
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
</script>

<svelte:head>
    <title>Memo</title>
</svelte:head>
<div class="flex justify-center items-start mt-8">
    <div class="flex justify-between items-center max-w-6xl">
        <div class="flex flex-grow items-center">
            <!-- flashcard portion -->
            <div class="flex-grow ml-8" style="flex-basis: 60%;">
                <div 
                    class="border-2 py-10 px-20 flex items-center relative justify-center bg-zinc-800 shadow-lg rounded-xl cursor-pointer" 
                    on:click={toggle}
                    on:keydown={handleKeydown}
                    tabindex="0"  
                    role="button"  
                    aria-label="Toggle flashcard" 
                    style="max-width: 900px; width: 100%; height: auto; aspect-ratio: 5/3;"
                >
                    <div class="wrap flex justify-center text-center text-3xl w-full min-h-full" bind:this={frontElement}>
                        {#if isFront}
                            <div>{front}</div>
                        {:else}
                            <div class="flex justify-center text-center w-full min-h-full" bind:this={backElement}>{@html back}</div>
                        {/if}
                    </div>
                    <div class="flex absolute bottom-2 left-2 py-1 px-2 rounded text-xl">
                        {isFront ? 'Front' : 'Back'} 
                    </div>
                    <div class="flex absolute top-2 left-2 p-1 rounded hover:bg-zinc-700">
                        <ArrowLeftRight size={36} />
                    </div>
                </div>
            </div>
            <!-- text portion -->
            <div class="flex-none mx-8" style="flex-basis: 35%;">
                <h1 class="text-5xl font-semibold mb-4">Study Easily</h1>
                <p class="text-lg mb-6">Memo is more than just flashcards and notes. Create, share, and study flashcard sets with others.</p>
                <div>
                    <button class="bg-gray-100 w-28 mr-1 hover:bg-neutral-400 text-zinc-600 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out" on:click={() => goTo('/flashcardsets')}>View Sets</button>
                    <button class="bg-gray-100 w-28 hover:bg-neutral-400 text-zinc-600 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out" on:click={() => goTo('/sign-up')}>Sign up</button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    .wrap {
        max-height: 100%;
        overflow-y: auto; 
    }
  
    .wrap::-webkit-scrollbar {
        width: 4px;
    }
  
    .wrap::-webkit-scrollbar-track {
        background: transparent;
    }
  
    .wrap::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 2px;
    }
  
    .wrap::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.8);
    }
</style>

  