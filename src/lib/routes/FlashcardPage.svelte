<script>
    import { fetchFlashcardSet } from "../../api/getFlashcardSet";
    import { deleteFlashcardFromSet } from "../../api/deleteFlashcardFromSet";
    import { isAuthenticated, checkAuthentication, name } from '../../stores/authStore.js';
    import Flashcard from "../components/Flashcard.svelte";
    import { Link } from 'svelte-routing';
    import { onMount } from "svelte";

    import { ChevronLeft, ChevronRight, ChevronsDown, ChevronsUp, Pencil, PenSquare, Trash2 } from 'lucide-svelte';

    export let id;
    let self = false;

    let flashcardSetData;
    let index = 0;
    let show = false;
    let error;

    let titleEdit = false;
    let descriptionEdit = false;

    let editingTitle = false;
    let editingDescription = false;
    let editedTitle = flashcardSetData?.flashcardSet?.title;
    let editedDescription = flashcardSetData?.flashcardSet?.description;

    function toggleTitleEdit() {
        editingTitle = !editingTitle;
        editedTitle = flashcardSetData.flashcardSet.title;
    }

    function toggleDescriptionEdit() {
        editingDescription = !editingDescription;
        editedDescription = flashcardSetData.flashcardSet.description;
    }

    async function saveTitle() {
        // Add logic to save the edited title to the backend
        flashcardSetData.flashcardSet.title = editedTitle;
        toggleTitleEdit();
    }

    async function saveDescription() {
        // Add logic to save the edited description to the backend
        flashcardSetData.flashcardSet.description = editedDescription;
        toggleDescriptionEdit();
    }

    function cancelTitleEdit() {
        editedTitle = flashcardSetData.flashcardSet.title;
        titleEdit = false;
        toggleTitleEdit();
    }

    function cancelDescriptionEdit() {
        editedDescription = flashcardSetData.flashcardSet.description;
        descriptionEdit = false;
        toggleDescriptionEdit();
    }

    onMount(async () => {
        await checkAuthentication();
        showLoading = true;
        fetchFlashcardSet(id)
            .then(data => {
                flashcardSetData = data;
                showLoading = false;
                self = $name === flashcardSetData?.flashcardSet?.users?.username;
            })
            .catch(e => {
                error = e;
                showLoading = false;
            });
    });

    async function deleteFlashcard(cardId) {
        try {
            await deleteFlashcardFromSet(id, cardId);
            flashcardSetData.flashcardSet.flashcards = flashcardSetData.flashcardSet.flashcards.filter(card => card.id !== cardId);
            flashcardSetData = { ...flashcardSetData };
        } catch (e) {
            console.error('Error deleting flashcard:', e);
        }
    }

    async function addFlashcard(newCard) {
        try {
            const addedCard = await addFlashcardToSet(id, newCard);
            flashcardSetData.flashcardSet.flashcards.push(addedCard);
        } catch (e) {
            console.error('Error adding flashcard:', e);
        }
    }

    function showTitleEdit() {
        titleEdit = !titleEdit;
    }

    function showDescriptionEdit() {
        descriptionEdit = !descriptionEdit;
    }

    const goBack = () => {
        if (index > 0) {
            console.log('back');
            index--;
        }
    }

    const goNext = (length) => {
        if (index < length - 1) {
            console.log('next');
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

    const showCards = () => {
        show = !show;
    }

    function autoGrow(element) {
        element.style.height = '5px';
        element.style.height = (element.scrollHeight) + 'px';
    }
</script>

<svelte:head>
    <title>Set {id}</title>
</svelte:head>
<div class="flex flex-col items-center">
    {#if !flashcardSetData}
        {#if showLoading}
            <div role="status" class="mt-3">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        {/if}
    {:else} 
        {#if flashcardSetData.message}
            <div class="text-3xl pb-2">Error!</div>
            <div class="text-lg text-zinc-500">
                {flashcardSetData.message}
            </div>
        {:else if flashcardSetData.flashcardSet.flashcards.length > 0}
            <div class="m-4">
                <Flashcard 
                    key={index}
                    front={flashcardSetData.flashcardSet.flashcards[index].front} 
                    back={flashcardSetData.flashcardSet.flashcards[index].back} 
                    description={flashcardSetData.flashcardSet.flashcards[index].description}
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
                <span class="text-xl">{index + 1} / {flashcardSetData.flashcardSet.flashcards.length}</span>
                <button
                    class="mx-4 px-4 py-1 rounded hover:bg-zinc-800 font-bold"
                    on:click={() => goNext(flashcardSetData.flashcardSet.flashcards.length)}
                    disabled={index === flashcardSetData.flashcardSet.flashcards.length - 1}
                >
                    <ChevronRight size={32}/>
                </button>
            </div>
            {#if editingTitle}
                <input bind:value={editedTitle} class="text-4xl text-white bg-transparent border-b-2 border-white px-4 mb-2" />
                <div class="flex gap-2 my-4">
                    <button class="px-4 py-1 rounded text-white bg-zinc-500 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-opacity-50 transition w-16 ease-in-out duration-150" on:click={saveTitle}>save</button>
                    <button class="px-2 py-1 rounded text-zinc-700 bg-white hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-opacity-50 w-16 transition ease-in-out duration-150" on:click={cancelTitleEdit}>cancel</button>
                </div>
            {:else}
                <div class="flex" on:mouseenter={showTitleEdit} on:mouseleave={showTitleEdit} tabindex="0" role="button">
                    <div class="text-4xl px-4 mb-2 flex justify-center">
                        <div class="relative inline-block text-center">
                            <h1 class="text-white">{flashcardSetData.flashcardSet.title}</h1>
                            {#if self && titleEdit}
                                <button class="absolute hover:text-zinc-500 -right-16 top-2 transform -translate-x-full" on:click={toggleTitleEdit}>
                                    <Pencil size={28} />
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}
            
            <div class="text-xl text-white mb-2">
                by <Link to="/user/{flashcardSetData.flashcardSet.users.username}" class="hover:underline">{flashcardSetData.flashcardSet.users.username}</Link>
            </div>

            {#if editingDescription}
                <textarea 
                    bind:value={editedDescription} 
                    rows="1"
                    on:input={e => autoGrow(e.target)} 
                    class="shadow appearance-none overflow-hidden border w-1/2 rounded mb-0 p-3 bg-zinc-800 text-neutral-200 leading-tight focus:outline-none focus:shadow-outline resize-none"></textarea>
                <div class="flex gap-2 my-4">
                    <button class="px-4 py-1 rounded text-white bg-zinc-500 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-opacity-50 transition w-16 ease-in-out duration-150" on:click={saveDescription}>save</button>
                    <button class="px-2 py-1 rounded text-zinc-700 bg-white hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-opacity-50 w-16 transition ease-in-out duration-150" on:click={cancelDescriptionEdit}>cancel</button>
                </div>
            {:else}
                <div class="flex" on:mouseenter={showDescriptionEdit} on:mouseleave={showDescriptionEdit} tabindex="0" role="button">
                    <div class="text-xl mb-2 flex justify-center">
                        <div class="relative inline-block text-center">
                            <div class="text-gray-400 font-normal px-8 max-w-2xl">
                                {flashcardSetData.flashcardSet.description}
                            </div>
                            {#if self && descriptionEdit}
                                <button class="absolute hover:text-zinc-500 -right-4 top-1 transform -translate-x-full" on:click={toggleDescriptionEdit}>
                                    <Pencil size={20} />
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/if}

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
                        Cards in this set ({flashcardSetData.flashcardSet.flashcards.length})
                    </div>
                    {#each flashcardSetData.flashcardSet.flashcards as card, i}
                        <div class="border-2 rounded-lg my-2">
                            <div class="flex justify-between items-center bg-zinc-800 border-b-2 border-neutral-700 rounded-b-none rounded-md px-4 py-2" style="min-height: 24px;">
                                <div class="text-lg font-bold">{i+1}</div>    
                                {#if self}
                                    <div class="flex gap-4">
                                        <button class="hover:text-blue-500"><PenSquare /></button>
                                        <button class="hover:text-red-500" on:click={() => deleteFlashcard(card.id)}><Trash2 /></button>
                                    </div> 
                                {/if}
                            </div>
                            <div class="flex justify-between bg-zinc-800 py-2 rounded-md" style="min-height: 56px;">
                                <div class="flex items-start w-1/3 px-4 py-2 border-r-2 border-neutral-700">{card.front}</div>
                                <div class="flex items-start w-2/3 px-4 py-2">{card.back}</div>       
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {:else}
            <div class="flex flex-col items-center m-4">
                <h1 class="text-4xl text-white px-4 mb-2">{flashcardSetData.flashcardSet.title}</h1>
                <div class="text-xl text-white mb-2">
                    by <Link to="/user/{flashcardSetData.flashcardSet.users.username}" class="hover:underline">{flashcardSetData.flashcardSet.users.username}</Link>
                </div>
                
                <div class="text-xl text-center text-gray-400 font-normal mb-8 max-w-2xl">
                    {flashcardSetData.flashcardSet.description}
                </div>
                <div class="text-xl text-gray-500">
                    There are no items in this flashcard set!
                </div>
            </div>
        {/if}
        {#if flashcardSetData.error}
            <div class="text-3xl pb-2">Error loading flashcard set: {flashcardSetData.error.message}</div>
        {/if}
    {/if}
</div>

