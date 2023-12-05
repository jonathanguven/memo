<script>
    import { Router, Route, Link, navigate, useLocation } from 'svelte-routing';
    import { isAuthenticated, checkAuthentication, logout } from './stores/authStore';
    import { onMount } from 'svelte';

    import About from './lib/routes/About.svelte';
    import CreateAcount from './lib/routes/CreateAcount.svelte';
    import Home from './lib/routes/Home.svelte';
    import Login from './lib/routes/Login.svelte';
    import Profile from './lib/routes/Profile.svelte';
    
    export let url = "";

    let route = '/';
    let userData = null;

    // TODO: fetch user data

    onMount(async () => {
        await checkAuthentication();
        if ($isAuthenticated) {
            try {
                const response = await fetch('http://localhost:3000/user', { credentials: 'include' });
                if (!response.ok) throw new Error('Failed to fetch user data');
                userData = await response.json();
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    })

    $: profileRoute = $isAuthenticated ? `/user/${userData?.username}` : '/login';


    function update(newRoute) {
        route = newRoute;
        console.log("routing to " + route)
    }

    async function handleLogout() {
        await logout(); 
        navigate('/'); 
    }

    function getBasePath(path) {
        const segments = path.split('/');
        return '/' + segments[1];
    }
</script>

<main class="flex flex-col h-screen p-3">
    <Router {url}>
        <nav class="navbar">
            <Link to="/" class="brand hover:underline" on:click={() => update('/')}>Flash</Link>
            <Link to="/about" class="nav-link hover:underline {route === '/about' ? 'active' : ''}" on:click={() => update('/about')}>About</Link>
            <Link to={profileRoute} class="nav-link hover:underline {getBasePath(route) === '/user' ? 'active' : ''}" on:click={() => update(profileRoute)}>Profile</Link>
            {#if $isAuthenticated}
                <button class="nav-link hover:underline" on:click={handleLogout}>Logout</button>
            {:else}
                <Link to="/login" class="nav-link hover:underline {route === '/login' ? 'active' : ''}" on:click={() => update('/login')}>Login</Link>
            {/if}
        </nav>

        <div class="flex justify-center flex-grow mt-20">
            <Route path="/">
                <Home />
            </Route>

            <Route path="/login">
                <Login />
            </Route>

            <Route path="/user/:username">
                <Profile user="hi"/>
            </Route>

            <Route path="/about">
                <About />
            </Route>
            <Route path="/sign-up" component={CreateAcount}></Route>
        </div>    
    </Router>
</main>


