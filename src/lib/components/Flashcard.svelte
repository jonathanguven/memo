<script>
    export let front;
    export let back;
    export const description = '';

    import { ArrowLeftRight } from 'lucide-svelte';

    let isFront = true;

    function toggle() {
        isFront = !isFront;
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
</script>

<div class="flex items-center justify-center">
    <div 
        class="relative border-2 p-16 flex items-center justify-center bg-zinc-800 shadow-lg rounded-lg cursor-pointer" 
        on:click={toggle}
        on:keydown={handleKeydown}
        tabindex="0"  
        role="button"  
        aria-label="Toggle flashcard" 
        style="width: 720px; height: 405px"
    >
        <div class="text-center text-3xl">
            {#if isFront}
                <div>{front}</div>
            {:else}
                <div>{back}</div>
            {/if}
        </div>
        <div class="flex absolute bottom-2 left-2 py-1 px-2 rounded">
            {isFront ? 'Front' : 'Back'} 
        </div>
        <div class="flex absolute top-2 left-2 p-1 rounded hover:bg-zinc-700">
            <ArrowLeftRight />
        </div>
    </div>
</div>