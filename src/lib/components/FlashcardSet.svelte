<script>
    import { navigate } from 'svelte-routing';
    import { ArrowLeftRight, Info, Menu, PenSquare, Trash2, LockKeyhole, UnlockKeyhole } from 'lucide-svelte';
    import { deleteFlashcard } from '../../api/deleteFlashcard';

    export let title;
    export let description;
    export let timestamp = '';
    export let self = false;
    export let is_private = false;
    export let id;
    export let created_at; 

    export let onDelete

    let isTitle = true;
    let openMenu = false;
    let info = false;
    let popup = false;

    function redirect(id) {
        console.log(`redirecting to flashcard set ${id}`);
        navigate(`/flashcardsets/${id}`);
    }

    function editCard() {
        console.log(`Editing card ${id}`);
        // implement edit 
    }

    async function deleteConfirm() {
        console.log(`Deleting card ${id} created at ${created_at}`);
        const result = await deleteFlashcard(id);
        popup = false;
        if (result.message) {
            onDelete(id); 
        }
    }

    function toggle() {
        openMenu = !openMenu;
    }

    function showModal() {
        popup = !popup;
    }

    function handleClick(event, action) {
        event.stopPropagation(); // stop event bubbling

        if (action === 'edit') {
            editCard();
        } else if (action === 'delete') {
            showModal();
        } else if (action === 'info') {
            info = !info
        } else if (action === 'toggle') {
            isTitle = !isTitle;
        }
        openMenu = false;
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
</script>

<div>
    <button 
        class="flashcard relative border-2 p-16 flex items-center justify-center bg-zinc-800 shadow-xl rounded-xl cursor-pointer" 
        on:click={redirect(id)}
    >
        <div class="text-center text-3xl">
            {#if isTitle}
                <div>{title}</div>
            {:else}
                <div>{description}</div>
            {/if}
        </div>

        <div class="flex absolute bottom-2 left-2 py-1 px-2 rounded text-xl">
            {isTitle ? 'Front' : 'Back'} 
        </div>

        <div    class="flex absolute top-2 left-2 p-1 rounded hover:bg-zinc-700"
                on:click={(event) => handleClick(event, 'toggle')}
                on:keydown={handleKeydown}
                aria-label="Toggle flashcard"
                role="button"
                tabindex="0"
        >
            <ArrowLeftRight size={32} />
        </div>

        <!-- popover for options -->
        {#if self}
            <button 
                class="flex absolute top-2 right-2 p-1 rounded hover:bg-zinc-700"
                on:mouseenter={toggle}
            >
                <Menu size={36} />
            </button>
            {#if openMenu}
                <div 
                    class="flex flex-col absolute top-14 right-2 bg-zinc-900 shadow-md rounded-lg p-2"
                    on:mouseleave={toggle}
                    tabindex="0"  
                    role="button"
                    aria-label="Toggle Menu"
                >
                    <div class="tooltip">
                        <button 
                            class="block hover:bg-zinc-700 p-2 rounded"
                            on:click={(event) => handleClick(event, 'edit')}
                        >
                            <PenSquare />
                        </button>
                        <span class="tooltiptext py-1 px-3 bg-zinc-950">Edit Card</span>
                    </div>
                    <div class="tooltip">
                        <button 
                            class="block hover:bg-zinc-700 p-2 rounded"
                            on:click={(event) => handleClick(event, 'delete')}
                        >
                            <Trash2 color="#c62828"/>
                        </button>
                        <span class="tooltiptext py-1 px-3 bg-zinc-950">Delete Card</span>
                    </div>
                    
                    
                </div>
            {/if}
        {:else}
            <div class="flex absolute top-2 right-2 p-1 rounded cursor-not-allowed">
                <Menu size={32} color="#424242"/>
            </div>
        {/if}
        

        <div class="flex absolute bottom-2 right-2 p-1 rounded hover:bg-zinc-700"
            on:mouseenter={(event) => handleClick(event, 'info')}
            on:mouseleave={(event) => handleClick(event, 'info')}
            tabindex="-2"  
            role="button"
            aria-label="Toggle info">
            <Info size={32} />
        </div>
        {#if info}
            <div class="absolute bottom-2 right-14 shadow-lg bg-zinc-900 rounded-lg p-2">
                Created {timestamp}
            </div>
            {#if is_private}
                <div class="absolute bottom-14 right-2 shadow-lg bg-zinc-900 rounded-lg p-2" style="height: 44px;">
                    <LockKeyhole />
                </div>
            {:else if !is_private && self}
                <div class="absolute bottom-14 right-2 shadow-lg bg-zinc-900 rounded-lg p-2" style="height: 44px;">
                    <UnlockKeyhole />
                </div>
            {/if}
        {/if}
    </button>
    {#if popup}
    <div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
        <div class="modal bg-zinc-900 w-full max-w-lg mx-auto rounded-lg shadow-xl p-6">
            <h3 class="text-2xl text-white font-semibold mb-4">Are you absolutely sure?</h3>
            <p class="text-md text-zinc-400 mb-6">
                This action cannot be undone. This will permanently delete your flashcard set and remove it from our servers.
            </p>
            <div class="flex justify-end space-x-3">
                <button 
                    class="modal px-4 py-1 rounded text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-opacity-50 transition ease-in-out duration-150"
                    on:click={showModal}>
                        Cancel
                </button>
                <button 
                    class="px-4 py-1 rounded text-zinc-700 bg-white hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-opacity-50 transition ease-in-out duration-150"
                    on:click={deleteConfirm}>
                        Continue
                </button>
            </div>
        </div>
    </div>
    
    {/if}
</div>

<style>
    .flashcard {
        width: 100%;
        aspect-ratio: 20/12;
    }
    .tooltip {
        position: relative;
        display: inline-block;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        min-width: max-content;
        color: white;
        text-align: center;
        border-radius: 6px;
        position: absolute;
        z-index: 1;
        top: 4px;
        right: 130%;
        margin-bottom: 5px;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }

    .modal {
        border: solid;
        border-width: 0.5px;
        border-color: rgb(88, 88, 88);
    }
</style>