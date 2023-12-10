<script>
    import { Link } from 'svelte-routing'
    import { fade } from 'svelte/transition'
    import { navigate } from 'svelte-routing'
    import { checkAuthentication } from '../../stores/authStore';

    const api = import.meta.env.VITE_API_URL;

    // form fields
    let name = '';
    let password = '';
    let confirm = '';

    let msg = '';
    let showMessage = false;

    // validators
    let nameError = '';
    let passwordError = '';
    let confirmError = '';

    const validateForm = () => {
        let isValid = true;

        nameError = passwordError = confirmError = '';

        if (name.length < 5 || name.length > 16) {
            nameError = '* Username must be between 5-16 chars';
            isValid = false;
            setTimeout(() => {
                nameError = '';
            }, 2000);
        }

        if (password.length < 8 || password.length > 16) {
            passwordError = '* Password must be between 8-16 chars';
            isValid = false;
            setTimeout(() => {
                passwordError = '';
            }, 2000);
        }

        if (password !== confirm) {
            confirmError = '* Passwords do not match';
            isValid = false;
            setTimeout(() => {
                confirmError = '';
            }, 2000);
        }

        return isValid;
    };

    const submitForm = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${api}/user/create-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: name,
                    password: password,
                })
            });
            const data = await response.json();
            msg = data.message;

            if (response.ok) {
                await checkAuthentication();
                navigate('/'); 
            } else {
                msg = data.message;
                setTimeout(() => {
                    msg = '';
                }, 2500);
            }

            name = password = confirm = '';
        } catch (error) {
            console.error('Error Submitting Data: ', error);
        }
    }
</script>

<svelte:head>
    <title>Create</title>
</svelte:head>
<div class="flex flex-col items-center bg-transparent">
    <h1 class="text-3xl p-4">Create Account</h1>
    <form on:submit|preventDefault={submitForm} class="border-2 px-4 py-4 rounded-xl shadow-md">
        <div>
            <label for="username" class="block text-md font-medium text-gray-100 text-left">
                Username
            </label>
            <input id="username" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                type="text" 
                bind:value={name} 
            />
            <div class="min-h-[20px] ">
                {#if nameError}
                    <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{nameError}</p>
                {/if}
            </div>
        </div>
        <div>
            <label for="password" class="block text-md font-medium text-gray-100 text-left">
                Password
            </label>
            <input id="password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                type="password" 
                bind:value={password} 
            />
            <div class="min-h-[20px] ">
                {#if passwordError}
                    <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{passwordError}</p>
                {/if}
            </div>
        </div>
        <div>
            <label for="confirm-password" class="block text-md font-medium text-gray-100 text-left">
                Confirm password
            </label>
            <input id="confirm-password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                type="password" 
                bind:value={confirm} 
            />
            <div class="min-h-[20px] ">
                {#if confirmError}
                    <p class="pt-1 text-xs text-red-500" out:fade={{ duration: 500 }}>{confirmError}</p>
                {/if}
            </div>
        </div>
        <div class="flex items-center justify-between mt-2">
            <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline">
                Submit
            </button>
        </div>
        <div class="mt-4 text-center">
            <p class="text-sm">Already have an account? 
                <Link to="/login" class="font-medium text-red-500 hover:text-red-700">Log in</Link>
            </p>
        </div>
    </form>
    <div class="min-h-[24px] flex justify-center items-center m-2">
        {#if showMessage}
            <p out:fade={{ duration: 500 }}>{msg}</p>
        {/if}
    </div>
</div>

<style>
    input {
        color: #242424;
        padding: 6px 12px
    }
</style>
