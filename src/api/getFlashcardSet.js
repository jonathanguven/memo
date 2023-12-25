const url = import.meta.env.VITE_API_URL;

export async function fetchFlashcardSet(id) {
    try {
        const response = await fetch(`${url}/api/flashcard-sets/${id}`, {
            credentials: 'include'
        });

        if (response.status === 403 || response.status === 404) {
            // throw new Error(`Error: ${response.status}`);
            return await response.json();
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to public flashcard sets:', error);
        return null; 
    }
}