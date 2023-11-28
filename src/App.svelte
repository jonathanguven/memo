<script>
    import { Router, Route, Link, useLocation } from 'svelte-routing';
    
    import CreateAcount from './lib/routes/CreateAcount.svelte';
    import Home from './lib/routes/Home.svelte';
    import Login from './lib/routes/Login.svelte';

    export let url = "";

    let route = '/';

    function update(newRoute) {
        route = newRoute;
    }

</script>

<main class="flex flex-col h-screen p-3">
    <Router {url}>
        <nav class="navbar">
            <Link to="/" class="brand" on:click={() => update('/')}>Flash</Link>
            <!-- TODO -->
            <Link to="/about" class="nav-link {route === '/about' ? 'active' : ''}" on:click={() => update('/about')}>About</Link>
            <Link to="/profile" class="nav-link {route === '/profile' ? 'active' : ''}" on:click={() => update('/profile')}>Profile</Link>
            <Link to="/login" class="nav-link {route === '/login' ? 'active' : ''}" on:click={() => update('/login')}>Login</Link>
        </nav>

        <div class="flex justify-center flex-grow mt-40">
            <Route path="/" component={Home}></Route>
            <Route path="/login" component={Login}></Route>

            <Route path="/profile">profile</Route>
            <Route path="/about">about</Route>
            <Route path="/sign-up" component={CreateAcount}></Route>
        </div>    
    </Router>
</main>


