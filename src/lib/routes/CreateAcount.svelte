<script>
    import { Link } from 'svelte-routing'
    import { fade } from 'svelte/transition'

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
            nameError = 'Username must be between 5-16 chars';
            isValid = false;
        }

        if (password.length < 8 || password.length > 16) {
            passwordError = 'Password must be between 8-16 chars';
            isValid = false;
        }

        if (password !== confirm) {
            confirmError = 'Passwords do not match';
            isValid = false;
        }

        return isValid;
    };

    const submitForm = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    password: password,
                    confirm: confirm,
                })
            });

            const data = await response.json();
            msg = data.message;

            showMessage = true;
            setTimeout(() => {
                showMessage = false;
            }, 1500);

            name = password = confirm = '';
        } catch (error) {
            console.error('Error Submitting Data: ', error);
        }
    }
</script>

<div class="flex flex-col items-center bg-transparent">
    <h1 class="text-3xl p-4">Create Account</h1>
    <form on:submit|preventDefault={submitForm} class="border-2 px-6 py-6 rounded-xl shadow-md">
        <div class="mb-4">
            <label for="username" class="block text-md font-medium text-gray-100 text-left">
                Username (5-16 bytes)
            </label>
            <input id="username" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                type="text" 
                bind:value={name} 
            />
            {#if nameError}
                <p class="pt-1 text-sm text-red-500">{nameError}</p>
            {/if}
        </div>
        <div class="mb-4">
            <label for="password" class="block text-md font-medium text-gray-100 text-left">
                Password (8-72 bytes)
            </label>
            <input id="password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                type="password" 
                bind:value={password} 
            />
            {#if passwordError}
                <p class="pt-1 text-sm text-red-500">{passwordError}</p>
            {/if}
        </div>
        <div class="mb-6">
            <label for="confirm-password" class="block text-md font-medium text-gray-100 text-left">
                Confirm password
            </label>
            <input id="confirm-password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                type="password" 
                bind:value={confirm} 
            />
            {#if confirmError}
                <p class="pt-1 text-sm text-red-500">{confirmError}</p>
            {/if}
        </div>
        <div class="flex items-center justify-between">
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
