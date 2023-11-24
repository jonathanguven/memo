<script>
    import { fade } from 'svelte/transition'
    import { Router, Link, Route } from 'svelte-routing';

    import Login from './lib/routes/Login.svelte';
    import Home from './lib/routes/Home.svelte';

    export let url = "";
</script>

<Router {url}>
    <!-- make them show up right here -->
    <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
    </nav>

    <main>
        <h1>sup</h1>
    </main>

    <div>
        <!-- Define route paths right here -->
        <Route path="/"><Home /></Route>
        <Route path="/login" component={Login}>Login</Route>
    </div>
</Router>



<style>

</style>

