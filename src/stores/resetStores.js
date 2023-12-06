import { clearAuth } from './authStore';
import { clearUser } from './userStore';

export function resetStores() {
    clearAuth();
    clearUser();
    // Add other reset store functions here
}