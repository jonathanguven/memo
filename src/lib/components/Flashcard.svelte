<script>
    export let front;
    export let back;
    export const description = '';

    let isFront = true;

    function toggle() {
        isFront = !isFront;
    }

    function handleKeydown(event) {
        if (event,key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
</script>

<div class="flex items-center justify-center">
    <div 
        class="flex items-center justify-center w-96 h-64 bg-zinc-800 shadow-lg rounded-lg cursor-pointer" 
        on:click={toggle}
        on:keydown={handleKeydown}
        tabindex="0"  
        role="button"  
        aria-label="Toggle flashcard" 
    >
        <div class="text-center text-3xl">
            {#if isFront}
                <div class="text-3xl">{front}</div>
            {:else}
                <div class="text-3xl">{back}</div>
            {/if}
        </div>
    </div>
</div>