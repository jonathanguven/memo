<script>
    import { onMount } from 'svelte';
    import { Router, Route, Link, navigate } from 'svelte-routing';

    import { isAuthenticated, checkAuthentication, name } from './stores/authStore';
    import { resetStores } from './stores/resetStores';
    
    import About from './lib/routes/About.svelte';
    import Create from './lib/routes/Create.svelte';
    import CreateAccount from './lib/routes/CreateAccount.svelte';
    import FlashcardRoutes from './lib/routes/FlashcardsRoute.svelte';
    import FlashcardSets from './lib/routes/FlashcardPage.svelte';
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
        profileRoute = `/user/${$name}`;
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
            <Link to="/" class="text-gray-300 brand hover:underline" on:click={() => update('/')}>Memo</Link>
            <Link to="/about" class="text-gray-300 nav-link hover:underline {route === '/about' ? 'active' : ''}" on:click={() => update('/about')}>About</Link>
            <Link to="/flashcardsets" class="text-gray-300 nav-link hover:underline {route === '/flashcards' ? 'active' : ''}" on:click={() => update('/flashcards')}>Cards</Link>
            <Link to="/flashcardsets/new" 
                class={`text-gray-300 nav-link hover:underline ${$isAuthenticated ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'} {route === '/flashcards/new' ? 'active' : ''}`}
                on:click={() => update('/flashcards/new')}>
                    Create
            </Link>
        </div>
        <div class="right">
            {#if $isAuthenticated}
                <Link to={profileRoute} 
                    class={`text-gray-300 nav-link px-3 py-2 hover:underline ${$isAuthenticated ? '' : 'opacity-50 cursor-not-allowed pointer-events-none'} {(route => '/' + route.split('/')[1]) === '/user' ? 'active' : ''}`} 
                    on:click={() => update(profileRoute)}>
                        Profile
                </Link>
                <button class="signup bg-gray-100 hover:bg-zinc-300 active:bg-zinc-700 active:text-gray-100 hover:text-zinc-700 text-zinc-700 px-3 py-2 rounded-lg transition duration-150 ease-in-out " on:click={handleLogout}>Logout</button>
            {:else}
                <Link to="/login" class="text-gray-300 nav-link hover:underline hover:bg-zinc-600 hover:text-gray-100 px-3 py-2 rounded-lg transition duration-150 ease-in-out {route === '/login' ? 'active' : ''}" on:click={() => update('/login')}>Login</Link>
                <Link to="/sign-up" 
                    class="signup bg-gray-100 hover:bg-zinc-400 active:bg-zinc-700 active:text-gray-100 hover:text-zinc-700 text-zinc-700 px-3 py-2 rounded-lg transition duration-150 ease-in-out {route === '/sign-up' ? 'active' : ''}" 
                    on:click={() => update('/sign-up')}>
                    Sign Up
                </Link>
            {/if}
        </div>
    </nav>

    <div class="flex justify-center flex-grow my-16">
        <Route path="/">
            <Home />
        </Route>

        <Route path="/flashcardsets/new">
            <ProtectedRoute component={Create} />
        </Route>

        <Route path="/flashcardsets">
            <FlashcardRoutes />
        </Route>
        
        <Route path="/about">
            <About />
        </Route>

        <Route path="/user/:username" let:params>
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