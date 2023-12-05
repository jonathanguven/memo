import { writable } from 'svelte/store';

const url = import.meta.env.VITE_API_URL;

export const isAuthenticated = writable(false);

// check login status
export async function checkAuthentication() {
    try {
        const response = await fetch(`${url}/auth/check`, { 
            credentials: 'include',
        });
        const data = await response.json();
        isAuthenticated.set(data.isAuthenticated);
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

// logout function is here to clear store
export async function logout() {
    try {
        // Call the backend endpoint to clear the JWT cookie
        await fetch(`${url}/logout`, {
            method: 'POST',
            credentials: 'include' 
        });
        // Update the isAuthenticated store
        isAuthenticated.set(false);
    } catch (error) {
        console.error('Error during logout:', error);
    }
}