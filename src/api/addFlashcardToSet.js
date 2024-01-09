const url = import.meta.env.VITE_API_URL;

async function addFlashcardToSet(setId, cardData) {
    try {
        const response = await fetch(`${url}/api/flashcard-sets/${setId}/flashcards`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData)
        });

        if (!response.ok) {
            console.log(response.json())
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const addedCard = await response.json();
        console.log(addedCard)
        return addedCard;
    } catch (error) {
        console.error('Error adding flashcard:', error);
        throw error; 
    }
}

export { addFlashcardToSet };
