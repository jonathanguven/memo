<script>
    import { Router, Route, Link, navigate, useLocation } from 'svelte-routing';
    import { isAuthenticated, checkAuthentication, logout } from './stores/authStore';
    import { onMount } from 'svelte';

    import CreateAcount from './lib/routes/CreateAcount.svelte';
    import Home from './lib/routes/Home.svelte';
    import Login from './lib/routes/Login.svelte';
    
    export let url = "";

    let route = '/';
    $: loggedIn = $isAuthenticated ? 'Logged in' : 'Logged out';

    onMount(async () => {
        await checkAuthentication();
    })

    function update(newRoute) {
        route = newRoute;
    }

    async function handleLogout() {
        await logout(); 
        navigate('/'); 
    }
</script>

<main class="flex flex-col h-screen p-3">
    <Router {url}>
        <nav class="navbar">
            <Link to="/" class="brand" on:click={() => update('/')}>Flash</Link>
            <!-- TODO -->
            <Link to="/about" class="nav-link {route === '/about' ? 'active' : ''}" on:click={() => update('/about')}>About</Link>
            <Link to="/profile" class="nav-link {route === '/profile' ? 'active' : ''}" on:click={() => update('/profile')}>Profile</Link>
            {#if $isAuthenticated}
                <button class="nav-link" on:click={handleLogout}>Logout</button>
            {:else}
                <Link to="/login" class="nav-link {route === '/login' ? 'active' : ''}" on:click={() => update('/login')}>Login</Link>
            {/if}
        </nav>

        <div class="flex justify-center flex-grow mt-40">
            <Route path="/"><Home text={loggedIn}/></Route>
            <Route path="/login" component={Login}></Route>

            <Route path="/profile">profile</Route>
            <Route path="/about">about</Route>
            <Route path="/sign-up" component={CreateAcount}></Route>
        </div>    
    </Router>
</main>


