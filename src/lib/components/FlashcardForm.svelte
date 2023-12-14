<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing'
  
    const dispatch = createEventDispatcher();
    const url = import.meta.env.VITE_API_URL;
  
    let title = '';
    let description = '';
    let flashcards = [{ front: '', back: '' }];
    let isPrivate = false;
    let msg = '';
    let showError = false;
  
    function addFlashcard() {
        flashcards = [...flashcards, { front: '', back: '' }];
    }
  
    function removeFlashcard(index) {
        flashcards = flashcards.filter((_, i) => i !== index);
    }
  
    const submitForm = async () => {
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
</script>
  
<form on:submit|preventDefault={submitForm}>
    <div>
        <label for="name">Name</label>
        <input id="name" type="text" bind:value={title} />
    </div>
    <div>
        <label for="description">Description</label>
        <textarea id="description" bind:value={description}></textarea>
    </div>
    <div>
        <label>
            <input type="checkbox" bind:checked={isPrivate} />
            Private Set
        </label>
    </div>
    
    {#each flashcards as flashcard, index (index)}
        <div class="flashcard-input">
            <textarea placeholder="Front" bind:value={flashcard.front}></textarea>
            <textarea placeholder="Back" bind:value={flashcard.back}></textarea>
            <button type="button" on:click={() => removeFlashcard(index)}>Remove</button>
        </div>
    {/each}
    
    <button type="button" on:click={addFlashcard}>Add flashcard</button>
    <button type="submit">Submit</button>
</form>
  
<style>
    .flashcard-input {
        display: flex;
        gap: 16px;
        margin-bottom: 8px;
    }
    textarea {
        resize: vertical;
    }
</style>
  