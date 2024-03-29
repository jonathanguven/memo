const url = import.meta.env.VITE_API_URL;

export async function fetchUserData(username) {
    try {
        const response = await fetch(`${url}/user/${username}`, {
            credentials: "include"
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null; 
    }
}