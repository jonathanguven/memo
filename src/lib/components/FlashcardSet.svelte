<script>
    import { navigate } from 'svelte-routing';

    export let front;
    export let back;
    export const description = '';

    export let id;

    import { ArrowLeftRight } from 'lucide-svelte';

    let isFront = true;

    function toggle() {
        isFront = !isFront;
    }

    function redirect(id) {
        console.log(`redirecting to flashcard set ${id}`);
        navigate(`/flashcardsets/${id}`);
    }

</script>

<div class="flex items-center justify-center">
    <button 
        class="relative border-2 p-16 flex items-center justify-center bg-zinc-800 shadow-lg rounded-lg cursor-pointer" 
        on:mouseenter={toggle}
        on:mouseleave={toggle}
        on:click={redirect(id)}
        tabindex="0"  
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
        <div class="flex absolute bottom-2 left-2 py-1 px-2 rounded text-xl">
            {isFront ? 'Front' : 'Back'} 
        </div>
        <div class="flex absolute top-2 left-2 p-1 rounded hover:bg-zinc-700">
            <ArrowLeftRight size={36} />
        </div>
    </button>
</div>