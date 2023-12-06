import { writable } from 'svelte/store';

export const userData = writable(null);

export async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:3000/user', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        userData.set(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        userData.set(null);
    }
}

export async function clearUser() {
    userData.set(null);
}