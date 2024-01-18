<script>
    import { ArrowLeftRight } from 'lucide-svelte';
    import { afterUpdate } from 'svelte';
    
    export let front;
    export let back;
    export let key;

    let frontElement;
    let backElement;
    let isFront = true;

    function isOverflowing(element) {
        return element && element.scrollHeight > element.clientHeight;
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

    afterUpdate(() => {
        checkOverflow();
    });

    $: frontClass = isOverflowing(frontElement) ? 'items-start' : 'items-center';
    $: backClass = isOverflowing(backElement) ? 'items-start' : 'items-center';
    
    $: if (key) {
        isFront = true;
    }

    $: if (front || back) {
        isFront = true;
    }

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
        class="relative border-2 p-16 flex items-center justify-center bg-zinc-800 shadow-lg rounded-xl cursor-pointer" 
        on:click={toggle}
        on:keydown={handleKeydown}
        tabindex="0"  
        role="button"  
        aria-label="Toggle flashcard" 
        style="width: 720px; height: 405px"
    >
        <div class="wrap flex justify-center text-3xl w-full min-h-full {frontClass}" bind:this={frontElement}>
            {#if isFront}
                <div style="white-space: pre-wrap;">{front}</div>
            {:else}
                <div class="flex justify-center w-full min-h-full {backClass}" style="white-space: pre-wrap;" bind:this={backElement}>{back}</div>
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

<style>
    .flashcard {
        width: 100%;
        aspect-ratio: 20/12;
        overflow: hidden;
    }

    .wrap {
        max-height: 100%;
        overflow-y: auto; 
    }

    .wrap::-webkit-scrollbar {
        width: 4px; /* Width of the scrollbar */
    }

    .wrap::-webkit-scrollbar-track {
        background: transparent; /* Transparent track */
    }

    .wrap::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.6); /* Scrollbar handle color */
        border-radius: 2px; /* Rounded corners on the scrollbar handle */
    }

    .wrap::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.8); /* Scrollbar handle color on hover */
    }
</style>