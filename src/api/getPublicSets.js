const url = import.meta.env.VITE_API_URL;

export async function fetchPublicSets() {
    try {
        const response = await fetch(`${url}/api/flashcards`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.flashcardSets;
    } catch (error) {
        console.error('Failed to public flashcard sets:', error);
        return null; 
    }
}