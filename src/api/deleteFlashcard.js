const url = import.meta.env.VITE_API_URL;

export async function deleteFlashcard(id) {
    try {
        const response = await fetch(`${url}/api/flashcard-sets/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to delete flashcard set:', error);
        return 'Failed to delete flashcard set'; 
    }
}