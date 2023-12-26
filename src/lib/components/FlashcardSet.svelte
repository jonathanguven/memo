<script>
    import { navigate } from 'svelte-routing';
    import { MoreVertical, ArrowLeftRight, Info, Menu } from 'lucide-svelte';

    export let title;
    export let description;
    export let timestamp = '';

    export let id;

    let isTitle = true;
    let openMenu = false;
    let info = false;

    function redirect(id) {
        console.log(`redirecting to flashcard set ${id}`);
        navigate(`/flashcardsets/${id}`);
    }

    function editCard() {
        console.log(`Editing card ${id}`);
        // implement edit 
    }

    function deleteCard() {
        console.log(`Deleting card ${id}`);
        // implement delete 
    }

    function handleClick(event, action) {
        event.stopPropagation(); // stop event bubbling

        if (action === 'menu') {
            openMenu = !openMenu;
        } else if (action === 'edit') {
            editCard();
        } else if (action === 'delete') {
            deleteCard();
        } else if (action === 'info') {
            info = !info
        } else if (action === 'toggle') {
            isTitle = !isTitle;
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggle();
        }
    }
</script>

<div class="flex items-center justify-center">
    <button 
        class="relative border-2 p-16 flex items-center justify-center bg-zinc-800 shadow-lg rounded-lg cursor-pointer" 
        on:mouseenter={(event) => handleClick(event, 'toggle')}
        on:mouseleave={(event) => handleClick(event, 'toggle')}
        on:click={redirect(id)}
        tabindex="0"  
        aria-label="Toggle flashcard" 
        style="width: 720px; height: 405px"
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
            <ArrowLeftRight size={36} />
        </div>

        <!-- popover for options -->
        <button 
            class="flex absolute top-2 right-2 p-1 rounded hover:bg-zinc-700"
            on:mouseenter={(event) => handleClick(event, 'menu')}>
            <Menu size={36} />
        </button>

        {#if openMenu}
            <div 
                class="flex flex-col absolute top-14 right-2 bg-zinc-900 shadow-md rounded-lg p-2"
                on:mouseleave={(event) => handleClick(event, 'menu')}
                tabindex="0"  
                role="button"
                aria-label="Toggle Menu"
            >
                <button class="block hover:bg-zinc-700 p-2 rounded"
                        on:click={(event) => handleClick(event, 'edit')}>
                    Edit
                </button>
                <button class="block hover:bg-zinc-700 p-2 rounded"
                        on:click={(event) => handleClick(event, 'delete')}>
                    Delete
                </button>
            </div>
        {/if}

        <div class="flex absolute bottom-2 right-2 p-1 rounded hover:bg-zinc-700"
            on:mouseenter={(event) => handleClick(event, 'info')}
            on:mouseleave={(event) => handleClick(event, 'info')}
            tabindex="-2"  
            role="button"
            aria-label="Toggle info">
            <Info size={36} />
        </div>
        {#if info}
            <div class="absolute bottom-14 right-2 shadow-lg bg-zinc-900 rounded-lg p-2">
                Created {timestamp}
            </div>
        {/if}
    </button>
</div>