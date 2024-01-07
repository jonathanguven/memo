const url = import.meta.env.VITE_API_URL;

export async function deleteFlashcardFromSet(setId, cardId) {
    try {
        const response = await fetch(`${url}/api/flashcard-sets/${setId}/flashcards/${cardId}`, {
            method: 'DELETE',
            credentials: 'include', 
        });

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        return await response.json();
    } catch (e) {
        console.error('Error deleting flashcard:', e);
        throw e;
    }
}
