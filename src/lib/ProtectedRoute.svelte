<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../stores/authStore.js';
    import { checkAuthentication } from '../stores/authStore.js';

    export let component;
    export let props = {};

    onMount(async () => {
        await checkAuthentication();
        if (!$isAuthenticated) {
            navigate('/login');
        }
    })
</script>

<svelte:component this={component} {...props}/>