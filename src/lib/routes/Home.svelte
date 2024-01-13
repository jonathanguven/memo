<script>
    import { Link, navigate } from 'svelte-routing';
    import { ArrowLeftRight } from 'lucide-svelte';
    import { afterUpdate } from 'svelte';

    let front = 'Optimize Your Study Habits';
    let back = 'Flashcards are the best way to quickly and easily memorize important vocabulary. Create, study, and share them with others.';
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

    function goTo() {
        navigate('/sign-up')
    }

    afterUpdate(() => {
        checkOverflow();
    });

    function toggle() {
        isFront = !isFront;
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
<div class="flex justify-center items-start mt-12 p-4 md:p-8">
    <div class="flex justify-between items-center w-full max-w-6xl">
        <div class="w-1/2">
            <h1 class="text-5xl font-semibold mb-4">Optimize Your Study Habits</h1>
            <p class="text-lg mb-6 pr-8">Memo is more than just flashcards and notes. Create, share, and study flashcard sets with others.</p>
            <div>
                <button class="bg-gray-100 w-28 mr-1 hover:bg-neutral-400 text-zinc-600 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out" on:click={() => goTo('/flashcardsets')}>View Sets</button>
                <button class="bg-gray-100 w-28 hover:bg-neutral-400 text-zinc-600 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out" on:click={() => goTo('/sign-up')}>Sign up</button>
            </div>
        </div>
        <div class="w-1/2 flex justify-end">
            <div 
                class="border-2 p-8 md:p-16 flex items-center relative justify-center bg-zinc-800 shadow-lg rounded-xl cursor-pointer" 
                on:click={toggle}
                on:keydown={handleKeydown}
                tabindex="0"  
                role="button"  
                aria-label="Toggle flashcard" 
                style="max-width: 720px; width: 100%; height: auto; aspect-ratio: 5/3;"
            >
                <div class="wrap flex justify-center text-center text-3xl w-full min-h-full" bind:this={frontElement}>
                    {#if isFront}
                        <div>{front}</div>
                    {:else}
                        <div class="flex justify-center text-left w-full min-h-full" bind:this={backElement}>{back}</div>
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
<!-- <main class="flex flex-col items-center w-full">
    <h1 class="text-3xl hover:scale-110 transition-all duration-700 ease-in-out cursor-default">
        Home
    </h1>
    <div class="flex justify-around items-center w-full border h-96">
        <div class="border min-w-md max-w-1/2">
            <div class="text-4xl">
                Optimize Your Study Habits
            </div>
            <div>
                Memo is more than just flashcards and notes. Create, share, and study flashcard sets with others
            </div>
        </div>
        <div class="border">
            <FlashcardSet />
        </div>
    </div>
</main> -->
  