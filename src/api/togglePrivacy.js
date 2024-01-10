const url = import.meta.env.VITE_API_URL;

export async function togglePrivacy(setId) {
    try {
        const response = await fetch(`${url}/api/flashcard-sets/${setId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to toggle flashcard set privacy:', error);
        return null; 
    }
}
