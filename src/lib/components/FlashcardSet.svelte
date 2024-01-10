<script>
    import { afterUpdate } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { ArrowLeftRight, Info, Menu, PenSquare, Trash2, LockKeyhole, UnlockKeyhole } from 'lucide-svelte';
    import { deleteFlashcard } from '../../api/deleteFlashcard';
    import { togglePrivacy } from '../../api/togglePrivacy';

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

    let titleElement;
    let descriptionElement;

    function isOverflowing(element) {
        return element && element.scrollHeight > element.clientHeight;
    }

    function checkOverflow() {
        if (titleElement) {
            titleElement.classList.toggle('items-start', isOverflowing(titleElement));
            titleElement.classList.toggle('items-center', !isOverflowing(titleElement));
        }
        if (descriptionElement) {
            descriptionElement.classList.toggle('items-start', isOverflowing(descriptionElement));
            descriptionElement.classList.toggle('items-center', !isOverflowing(descriptionElement));
        }
    }

    afterUpdate(() => {
        checkOverflow();
    });

    $: titleClass = isOverflowing(titleElement) ? 'items-start' : 'items-center';
    $: descriptionClass = isOverflowing(descriptionElement) ? 'items-start' : 'items-center';


    function redirect(id) {
        navigate(`/flashcardsets/${id}`);
    }

    async function editPrivacy() {
        const response = await togglePrivacy(id);
        if (response && !response.error) {
            is_private = !is_private;
        } else {
            console.error('Error toggling privacy:', response?.error);
        }
    }

    async function deleteConfirm() {
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

        if (action === 'togglePrivacy') {
            editPrivacy();
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
        class="flashcard relative border-2 py-8 px-14 flex items-center justify-center bg-zinc-800 shadow-xl rounded-xl cursor-pointer" 
        on:click={redirect(id)}
    >
        <div class="wrap flex justify-center text-3xl w-full min-h-full {titleClass}" bind:this={titleElement}>
            {#if isTitle}
                <div>{title}</div>
            {:else}
                <div class="flex justify-center w-full min-h-full {descriptionClass}" bind:this={descriptionElement}>{description}</div>
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
                    {#if is_private}
                        <div class="tooltip">
                            <button 
                                class="block hover:bg-zinc-700 p-2 rounded"
                                on:click={(event) => handleClick(event, 'togglePrivacy')}
                            >
                                <LockKeyhole />
                            </button>
                            <span class="tooltiptext py-1 px-3 bg-zinc-950">Make Public</span>
                        </div>
                    {:else}
                        <div class="tooltip">
                            <button 
                                class="block hover:bg-zinc-700 p-2 rounded"
                                on:click={(event) => handleClick(event, 'togglePrivacy')}
                            >
                                <UnlockKeyhole />
                            </button>
                            <span class="tooltiptext py-1 px-3 bg-zinc-950">Make Private</span>
                        </div>
                    {/if}
                    
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
        transition: opacity 0.3s, visibility 0s linear 1s;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
        transition-delay: 0.3s;
    }

    .modal {
        border: solid;
        border-width: 0.5px;
        border-color: rgb(88, 88, 88);
    }
</style>