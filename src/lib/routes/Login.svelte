<script>
    import { isAuthenticated, checkAuthentication } from '../../stores/authStore';
    import { Link } from 'svelte-routing'
    import { fade } from 'svelte/transition'
    import { navigate } from 'svelte-routing'

    const api = import.meta.env.VITE_API_URL;

    let username = '';
    let password = '';
    let remember = false;

    let nameError = '';
    let passwordError = '';

    let loginMessage = '';

    const validateForm = () => {
        nameError = passwordError = '';

        let isValid = true;

        if (username.length === 0) {
            nameError = '* This field is required';
            isValid = false;
            setTimeout(() => {
                nameError = '';
            }, 2000);
        }

        if (password.length === 0) {
            passwordError = '* This field is required';
            isValid = false;
            setTimeout(() => {
                passwordError = '';
            }, 2000);
        }

        return isValid;
    };

    const login = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            console.log(JSON.stringify({ username, password }))
            const response = await fetch(`${api}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password, remember })
            });

            const data = await response.json();

            if (response.ok) {
                await checkAuthentication();
                navigate('/'); 
            } else {
                loginMessage = data.message;
                setTimeout(() => {
                    loginMessage = '';
                }, 2500);
            }
        } catch (error) {
            loginMessage = 'An error occurred while logging in';
            console.error('Error logging in: ', error);
        }
    }
</script>

<div class="flex flex-col items-center bg-transparent">
    <h1 class="text-3xl p-4">Login</h1>
    <form on:submit|preventDefault={login} class="border-2 px-5 py-6 rounded-xl shadow-md">
        <div>
            <label for="username" class="block text-md font-medium text-gray-100 text-left">Username</label>
            <input id="username" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="text" bind:value={username} />
            <div class="min-h-[24px] ">
                {#if nameError}
                    <p class="pt-1 text-sm text-red-500" out:fade={{ duration: 500 }}>{nameError}</p>
                {/if}
            </div>
        </div>
        <div>
            <label for="password" class="block text-md font-medium text-gray-100 text-left">Password</label>
            <input id="password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="password" bind:value={password} />
            <div class="min-h-[24px] ">
                {#if passwordError}
                    <p class="pt-1 text-sm text-red-500" out:fade={{ duration: 500 }}>{passwordError}</p>
                {/if}
            </div>
        </div>
        <div class="flex text-left items-center">
            <label for="remember-me" class="text-sm mt-1">
                <input id="remember-me" type="checkbox" bind:checked={remember} />
                Remember me
            </label>
        </div>
        <div class="flex items-center justify-between mt-4">
            <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline ">Submit</button>
        </div>
        <div class="mt-6 text-center">
            <p class="text-sm">Don't have an account? 
                <Link to="/sign-up" class="font-medium text-red-500 hover:text-red-700">Sign Up</Link>
            </p>
        </div>
    </form>
    <div class="min-h-[48px] flex flex-col justify-center items-center m-2">
        {#if loginMessage}
            <div out:fade={{ duration: 500 }} class="text-red-500 text-lg">{loginMessage}</div>
        {/if}
    </div>
</div>

<style>
    input {
        color: #242424;
        padding: 6px 12px
    }
</style>