<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { navigate } from 'svelte-routing'
  
    const dispatch = createEventDispatcher();
    const url = import.meta.env.VITE_API_URL;
  
    let title = '';
    let description = '';
    let flashcards = [{ front: '', back: '' }];
    let isPrivate = false;
    let msg = '';
    let showError = false;

    // Form validators
    let titleError = '';
    let descriptionError = '';
    let flashcardsError = '';
  
    function addFlashcard() {
        flashcards = [...flashcards, { front: '', back: '' }];
    }
  
    function removeFlashcard(index) {
        flashcards = flashcards.filter((_, i) => i !== index);
        if (flashcards.length === 0) {
            addFlashcard(); 
        }
    }

    function validateForm() {
        let isValid = true;
        titleError = descriptionError = flashcardsError = '';

        if (title.length === 0) {
            titleError = '* This field is required';
            isValid = false;
            setTimeout(() => {
                titleError = '';
            }, 2000);
        }

        if (description.length === 0) {
            descriptionError = '* This field is required';
            isValid = false;
            setTimeout(() => {
                descriptionError = '';
            }, 2000);
        }

        if (flashcards.some(fc => fc.front.trim() === '' || fc.back.trim() === '')) {
            flashcardsError = '* All flashcards must have both front and back content';
            isValid = false;
            setTimeout(() => {
                flashcardsError = '';
            }, 2000);
        }

        return isValid;
    }
  
    const submitForm = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const response = await fetch(`${url}/api/flashcard-sets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    description,
                    is_private: isPrivate,
                    flashcards
                })
            });
            const data = await response.json();
            msg = data.message;
            showError = !response.ok;

            if (response.ok) {
                dispatch('submit', { data });
                navigate('/'); 
            } else {
                setTimeout(() => {
                msg = '';
                showError = false;
                }, 2500);
            }
        } catch (error) {
            console.error('Error Submitting Data:', error);
            msg = 'Failed to submit the form. Please try again.';
            showError = true;
        }
    }

    function autoGrow(element) {
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight) + 'px';
    }
</script>

<div class="bg-zinc-800 rounded-lg shadow px-6 pt-4 pb-8 border" style="min-width: 40vw">
    <form on:submit|preventDefault={submitForm}>
        <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1" for="title">
                Name
            </label>
            <input id="title" bind:value={title} class="mb-1 shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-700 text-neutral-200 leading-tight focus:outline-none focus:shadow-outline" placeholder="Discrete Mathematics">
            <div class="min-h-[24px] ">
                {#if titleError}
                    <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{titleError}</p>
                {/if}
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1" for="description">
                Description
            </label>
            <textarea   id="description" 
                        bind:value={description} 
                        class="shadow appearance-none border rounded w-full mb-0 py-2 px-3 bg-zinc-700 text-neutral-200 leading-tight focus:outline-none focus:shadow-outline resize-none" 
                        placeholder="This isn't even math" 
                        on:input={e => autoGrow(e.target)} style="overflow-y: hidden;" rows="1"></textarea>
            <div class="min-h-[24px] mt-0">
                {#if descriptionError}
                    <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{descriptionError}</p>
                {/if}
            </div>
        </div>

        {#each flashcards as flashcard, index}
            <div class="flex items-center mb-4">
                <div class="flex flex-col flex-1 mr-6">
                    <label class="block text-sm font-medium text-gray-300 mb-1" for={`front-${index}`}>
                        Front
                    </label>
                    <textarea   id={`front-${index}`} 
                                bind:value={flashcard.front} 
                                class="shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline resize-none" 
                                placeholder="Question"
                                on:input={e => autoGrow(e.target)} 
                                style="overflow-y: hidden; min-height: 38px;"
                                rows="1"></textarea>
                </div>
                <div class="flex flex-col flex-1 mr-4">
                    <label class="block text-sm font-medium text-gray-300 mb-1" for={`back-${index}`}>
                        Back
                    </label>
                    <textarea   id={`back-${index}`} 
                                bind:value={flashcard.back} 
                                class="shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline resize-none" 
                                placeholder="Answer"
                                on:input={e => autoGrow(e.target)} 
                                style="overflow-y: hidden; min-height: 38px;"
                                rows="1"></textarea>
                </div>
                <button type="button" class="mx-4 mt-6 text-gray-200 hover:text-red-500 focus:outline-none" on:click={() => removeFlashcard(index)}>
                    —
                </button>
            </div>
        {/each}

        <div class="flex items-center mt-6">
            <button type="button" class="text-md flex items-center px-4 py-3 border border-transparent leading-4 font-medium rounded-md text-gray-200 hover:bg-zinc-700 focus:outline-none" on:click={addFlashcard}>
                + Add flashcard
            </button>
        </div>
        <div class="min-h-[24px] ">
            {#if flashcardsError}
                <p class="py-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{flashcardsError}</p>
            {/if}
        </div>
        <div class="flex justify-center">
            <button type="submit" class="w-full px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:shadow-outline-blue active:bg-red-700 transition duration-150 ease-in-out" style="min-height: 38px;">
                Submit
            </button>
        </div>
    </form>

    
</div>

<style>

</style>
  