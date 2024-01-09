import { writable } from 'svelte/store';

const url = import.meta.env.VITE_API_URL;

export const isAuthenticated = writable(false);
export const name = writable(null);

// check login status
export async function checkAuthentication() {
    try {
        const response = await fetch(`${url}/auth/check`, { 
            credentials: 'include',
        });
        if (response.ok) {
            const data = await response.json();
            isAuthenticated.set(data.isAuthenticated);
            name.set(data.user.username);
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

// logout function is here to clear store
export async function clearAuth() {
    try {
        // Call the backend endpoint to clear the JWT cookie
        await fetch(`${url}/user/logout`, {
            method: 'POST',
            credentials: 'include' 
        });
        // Update the isAuthenticated store
        isAuthenticated.set(false);
        name.set(null)
        console.log("Successfully logged out");
    } catch (error) {
        console.error('Error during logout:', error);
    }
}