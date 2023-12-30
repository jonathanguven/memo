<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../stores/authStore.js';
    import { checkAuthentication } from '../stores/authStore.js';

    export let component;
    export let props = {};

    let authCheckPromise = checkAuthentication();
    let authenticated;

    authCheckPromise.then(() => {
        authenticated = $isAuthenticated;
        if (!authenticated) {
            navigate('/login');
        }
    });
</script>

{#await authCheckPromise then _}
    {#if authenticated}
        <svelte:component this={component} {...props} />
    {/if}
{:catch error}
    <p>Error checking authentication: {error.message}</p>
{/await}