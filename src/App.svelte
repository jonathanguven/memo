<script>
    import { onMount } from 'svelte';
    import { Router, Route, Link, navigate } from 'svelte-routing';
    import { isAuthenticated, checkAuthentication } from './stores/authStore';
    import { userData, fetchUserData } from './stores/userStore';
    import { resetStores } from './stores/resetStores';
    
    import About from './lib/routes/About.svelte';
    import CreateAccount from './lib/routes/CreateAccount.svelte';
    import Home from './lib/routes/Home.svelte';
    import Login from './lib/routes/Login.svelte';
    import Profile from './lib/routes/Profile.svelte';
    
    export let url = "";
    let route = '/';
    let profileRoute = '/login';

    onMount(async () => {
        await checkAuthentication();
        if ($isAuthenticated) {
            await fetchUserData();
        }
    })

    $: if ($isAuthenticated && $userData) {
        profileRoute = `/user/${$userData.username}`;
    } 

    function update(newRoute) {
        route = newRoute;
        console.log("routing to " + route)
    }

    async function handleLogout() {
        resetStores(); 
        profileRoute = '/login'
        navigate('/'); 
    }
</script>

<main class="flex flex-col h-screen p-3">
    <Router {url}>
        <nav class="navbar">
            <Link to="/" class="brand hover:underline" on:click={() => update('/')}>Flash</Link>
            <Link to="/about" class="nav-link hover:underline {route === '/about' ? 'active' : ''}" on:click={() => update('/about')}>About</Link>
            <Link to={profileRoute} class="nav-link hover:underline {(route => '/' + route.split('/')[1]) === '/user' ? 'active' : ''}" on:click={() => update(profileRoute)}>Profile</Link>
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
                <Profile userData={$userData}/>
            </Route>

            <Route path="/about">
                <About />
            </Route>
            <Route path="/sign-up" component={CreateAccount}></Route>
        </div>    
    </Router>
</main>


