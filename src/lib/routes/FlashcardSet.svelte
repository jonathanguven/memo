<script>
    import { fetchFlashcardSet } from "../../api/getFlashcardSet";
    import Flashcard from "../components/Flashcard.svelte";
    import { Link } from 'svelte-routing';
    import { onMount } from "svelte";

    import { ChevronLeft, ChevronRight, ChevronsDown, ChevronsUp, PlusCircle } from 'lucide-svelte';

    export let id;

    let promise = fetchFlashcardSet(id);
    let index = 0;
    let show = false;

    const goBack = () => {
        if (index > 0) {
            index--;
        }
    }

    const goNext = (length) => {
        if (index < length - 1) {
            index++;
        }
    }

    let showLoading = false;

    onMount(() => {
        const timer = setTimeout(() => {
            showLoading = true;
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    });

    const formatDate = ((unformatted) => {
        const date = new Date(unformatted);
        return 'Last Updated ' + date.toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
        });
    });

    const showCards = () => {
        show = !show;
        console.log('show switching to: ' + show)
    }
</script>

<svelte:head>
    <title>Set {id}</title>
</svelte:head>
<div class="flex flex-col items-center">
    {#await promise}
        <!-- loading spinner -->
        {#if showLoading}
            <div role="status" class="mt-3">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        {/if}
    {:then data} 
        {#if data.flashcardSet.flashcards.length > 0}
            <div class="m-4">
                <Flashcard 
                    front={data.flashcardSet.flashcards[index].front} 
                    back={data.flashcardSet.flashcards[index].back} 
                    description={data.flashcardSet.flashcards[index].description}
                />
            </div>

            <div class="flex items-center justify-center mb-8">
                <button
                    class="mx-4 px-4 py-1 rounded hover:bg-zinc-800 font-bold"
                    on:click={goBack}
                    disabled={index === 0}
                >
                    <ChevronLeft size={32}/>
                </button>
                <span class="text-xl">{index + 1} / {data.flashcardSet.flashcards.length}</span>
                <button
                    class="mx-4 px-4 py-1 rounded hover:bg-zinc-800 font-bold"
                    on:click={() => goNext(data.flashcardSet.flashcards.length)}
                    disabled={index === data.flashcardSet.flashcards.length - 1}
                >
                    <ChevronRight size={32}/>
                </button>
            </div>
        {/if}
        
        <h1 class="text-4xl text-white px-4 mb-2">{data.flashcardSet.title}</h1>
        <div class="text-xl text-white mb-2">
            by <Link to="/users/{data.flashcardSet.users.username}" class="hover:underline">{data.flashcardSet.users.username}</Link>
        </div>
        
        <div class="text-xl text-gray-400 font-normal mb-8">
            {data.flashcardSet.description}
        </div>

        {#if !show}
            <div 
                class="text-xl text-gray-300 font-normal mb-4 hover:text-zinc-500 active:text-zinc-600"
                on:click={showCards} 
                on:keydown={showCards}
                tabindex="0"  
                role="button"  
                aria-label="show cards"
            >                
                <ChevronsDown size={36} />
            </div>
        {:else}
            <div 
                class="text-xl text-gray-300 font-normal mb-4 hover:text-zinc-500 active:text-zinc-600"
                on:click={showCards} 
                on:keydown={showCards}
                tabindex="0"  
                role="button"  
                aria-label="hide cards"
            >
                <ChevronsUp size={36} />
            </div>
            <div class="mx-auto flex flex-col justify-center mb-12" style="width: 720px;">
                <div class="py-4 text-2xl font-semibold text-white" style="margin-left: 2px;">
                    Cards in this set ({data.flashcardSet.flashcards.length})
                </div>
                {#each data.flashcardSet.flashcards as card}
                    <div class="flex justify-between bg-zinc-800 border-2 mb-3 p-4 rounded-md shadow" style="min-height: 56px;">
                        <div class="w-1/3 border-r-2">{card.front}</div>
                        <div class="w-2/3 pl-4">{card.back}</div>
                    </div>
                {/each}
            </div>
        {/if}
        
    {:catch error}
        <div class="text-3xl pb-2">Error loading flashcard set: {error.message}</div>
    {/await}
</div>