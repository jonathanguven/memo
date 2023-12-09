const url = import.meta.env.VITE_API_URL;

export async function fetchUserData(username) {
    try {
        const response = await fetch(`${url}/user/${username}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null; 
    }
}