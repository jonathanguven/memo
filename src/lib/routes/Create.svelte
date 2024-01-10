<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { navigate } from 'svelte-routing'

    import { X, Plus } from 'lucide-svelte';
  
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
        } else if (title.length > 50) {
            titleError = `* Title must be less than 50 characters`;
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
        } else if (description.length > 200) {
            descriptionError = `* Description must be less than 200 characters`;
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
        } else if (flashcards.some(fc => fc.front.length > 400 || fc.back.length > 400)) {
            flashcardsError = `* Front and Back must each be less than 400 characters`;
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

<svelte:head>
    <title>Create</title>
</svelte:head>
<div class="flex flex-col items-center">
    <h1 class="text-4xl font-medium py-1">Create Flashcard Set</h1>
    <div class="w-full mt-6" style="min-width: 680px;">
    <div class="bg-zinc-800 rounded-lg shadow px-6 pt-4 pb-6 border" style="min-width: 40vw">
        <form on:submit|preventDefault={submitForm}>
            <div>
                <div class="flex justify-between">
                    <label class="block text-sm font-medium text-neutral-300 mb-1" for="title">
                        Name
                    </label>
                    <div class="text-sm text-neutral-300">{title.length} / 50</div>
                </div>
                
                <input id="title" bind:value={title} class="mb-1 shadow appearance-none border rounded w-full p-3 bg-zinc-800 text-neutral-200 leading-tight focus:outline-none focus:border-red-500 focus:shadow-outline" placeholder="Discrete Mathematics">
                <div class="min-h-[24px] ">
                    {#if titleError}
                        <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{titleError}</p>
                    {/if}
                </div>
            </div>
    
            <div>
                <div class="flex justify-between">
                    <label class="block text-sm font-medium text-neutral-300 mb-1" for="description">
                        Description
                    </label>
                    <div class="text-sm text-neutral-300">{description.length} / 200</div>
                </div>
                <textarea   id="description" 
                            bind:value={description} 
                            class="shadow appearance-none border rounded w-full mb-0 p-3 bg-zinc-800 text-neutral-200 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500 resize-none" 
                            placeholder="This isn't even math" 
                            on:input={e => autoGrow(e.target)} 
                            style="overflow-y: hidden; min-height: 50px; line-height: 150%;"
                            rows="1"></textarea>
                <div class="min-h-[24px] mt-0">
                    {#if descriptionError}
                        <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{descriptionError}</p>
                    {/if}
                </div>
            </div>
    
            {#each flashcards as flashcard, index}
                <div class="flex mb-4">
                    <div class="flex flex-col flex-1 mr-6">
                        <div class="flex justify-between">
                            <label class="block text-sm font-medium text-gray-300 mb-1" for={`front-${index}`}>
                                Front
                            </label>
                            <div class="text-sm text-neutral-300">{flashcard.front.length} / 400</div>
                        </div>
                        <textarea   id={`front-${index}`} 
                                    bind:value={flashcard.front} 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500 resize-none" 
                                    placeholder="Question"
                                    on:input={e => autoGrow(e.target)} 
                                    style="overflow-y: hidden; min-height: 42px; line-height: 150%;"
                                    rows="1"></textarea>
                    </div>
                    <div class="flex flex-col flex-1 mr-4">
                        <div class="flex justify-between">
                            <label class="block text-sm font-medium text-gray-300 mb-1" for={`back-${index}`}>
                                Back
                            </label>
                            <div class="text-sm text-neutral-300">{flashcard.back.length} / 400</div>
                        </div>
                        <textarea   id={`back-${index}`} 
                                    bind:value={flashcard.back} 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 bg-zinc-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-red-500 resize-none" 
                                    placeholder="Answer"
                                    on:input={e => autoGrow(e.target)} 
                                    style="overflow-y: hidden; min-height: 42px; line-height: 150%;"
                                    rows="1"></textarea>
                    </div>
                    <button type="button" class="border-none rounded mt-6 pb-2 pt-2 px-4 text-gray-200 font-bold hover:bg-zinc-700 focus:outline-none" on:click={() => removeFlashcard(index)}>
                        <X />
                    </button>
                </div>
            {/each}
    
            <div class="flex items-center">
                <button type="button" class="text-md flex items-center px-4 pr-5 py-3 mr-3 border border-transparent leading-4 font-medium rounded-md text-gray-200 hover:bg-zinc-700 focus:outline-none" on:click={addFlashcard}>
                    <span class="pr-1"><Plus size={20} /></span> Add flashcard
                </button>
                <label for="remember-me" class="text-md flex items-center pl-6 leading-4 font-medium rounded-md text-gray-200">
                    <input id="remember-me" type="checkbox" bind:checked={isPrivate} />
                    <span class="pl-1">Private</span>
                </label>
            </div>

            <div class="min-h-[24px] text-center">
                {#if flashcardsError}
                    <p class="py-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{flashcardsError}</p>
                {/if}
            </div>

            <div class="flex justify-center">
                <button type="submit" class="w-full border border-transparent text-md leading-5 font-medium rounded-md text-white bg-red-500 hover:bg-red-400 focus:outline-none focus:shadow-outline-red active:bg-red-700 transition duration-150 ease-in-out" style="min-height: 38px;">
                    Submit
                </button>
            </div>
        </form>
    </div>
    </div>
    
</div>
