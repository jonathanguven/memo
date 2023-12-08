<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../stores/authStore.js';

    export let component;
    export let props = {};

    onMount(() => {
        if (!$isAuthenticated) {
            navigate('/login');
        }
    });
</script>

<svelte:component this={component} {...props}/>