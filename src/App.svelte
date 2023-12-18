<script>
    import { onMount } from 'svelte';
    import { Router, Route, Link, navigate } from 'svelte-routing';

    import { isAuthenticated, checkAuthentication, name } from './stores/authStore';
    import { resetStores } from './stores/resetStores';
    
    import About from './lib/routes/About.svelte';
    import Create from './lib/routes/Create.svelte';
    import CreateAccount from './lib/routes/CreateAccount.svelte';
    import FlashcardRoutes from './lib/routes/FlashcardsRoute.svelte';
    import FlashcardSets from './lib/components/FlashcardSets.svelte';
    import Home from './lib/routes/Home.svelte';
    import Login from './lib/routes/Login.svelte';
    import Profile from './lib/routes/Profile.svelte';
    import ProtectedRoute from './lib/ProtectedRoute.svelte';
    import NotFound from './lib/routes/NotFound.svelte';
    
    export let url = "";
    let route = '/';
    let profileRoute = '/login';

    onMount(async () => {
        await checkAuthentication();
    })

    $: if ($isAuthenticated) {
        profileRoute = `/users/${$name}`;
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
        <div class="left">
            <Link to="/" class="brand hover:underline" on:click={() => update('/')}>Flash</Link>
            <Link to="/flashcards" class="nav-link hover:underline {route === '/flashcards' ? 'active' : ''}" on:click={() => update('/flashcards')}>Cards</Link>
            <Link to="/flashcards/new" class="nav-link hover:underline {route === '/flashcards/new' ? 'active' : ''}" on:click={() => update('/flashcards/new')}>Create</Link>
        </div>
        <div class="right">
            <Link to="/about" class="nav-link hover:underline {route === '/about' ? 'active' : ''}" on:click={() => update('/about')}>About</Link>
            <Link to={profileRoute} class="nav-link hover:underline {(route => '/' + route.split('/')[1]) === '/user' ? 'active' : ''}" on:click={() => update(profileRoute)}>Profile</Link>
            {#if $isAuthenticated}
                <button class="nav-link hover:underline" on:click={handleLogout}>Logout</button>
            {:else}
                <Link to="/login" class="nav-link hover:underline {route === '/login' ? 'active' : ''}" on:click={() => update('/login')}>Login</Link>
            {/if}
        </div>
    </nav>

    <div class="flex justify-center flex-grow mt-16">
        <Route path="/">
            <Home />
        </Route>

        <Route path="/flashcards/new">
            <ProtectedRoute component={Create} />
        </Route>

        <Route path="/flashcards">
            <FlashcardRoutes />
        </Route>
        
        <Route path="/about">
            <About />
        </Route>

        <Route path="/users/:username" let:params>
            <Profile username={params.username}></Profile>
        </Route>

        <Route path="/flashcardsets/:id" let:params>
            <FlashcardSets id={params.id}></FlashcardSets>
        </Route>

        <Route path="/login">
            <Login />
        </Route>

        <Route path="/sign-up">
            <CreateAccount />
        </Route>

        <Route path="*">
            <NotFound />
        </Route>
    </div>    
</Router>
</main>