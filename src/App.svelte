<script>
    import { fade } from 'svelte/transition'
    import { Router, Route, Link } from 'svelte-routing';

    import Login from './lib/routes/Login.svelte';
    import Home from './lib/routes/Home.svelte';

    export let base = "/";
    $: url = window.location.href
</script>

<Router {base}>
    <!-- content outside the main page, layout content -->
    <main>
        <h1>{url}</h1>
    </main>
    <!-- The navbar -->
    <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
    </nav>
    <!-- Here is where the "page" is loaded (depends on route) -->
    <div>
        <Route path="/"><Home /></Route>
        <Route path="/login" component={Login}>Login</Route>
    </div>    
</Router>



<style>

</style>

