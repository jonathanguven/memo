<script>
    import { fade } from 'svelte/transition'

    // form fields
    let name = '';
    let password = '';
    let confirm = '';

    let msg = '';
    let showMessage = false;

    const submitForm = async () => {
        try {
            const response = await fetch('http://localhost:3001/formSubmit', {
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

            name = ''
            password = ''
            confirm = ''
        } catch (error) {
            console.error('Error Submitting Data: ', error);
        }
    }
</script>

<div class="px-5 py-6 bg-transparent border-2 rounded-xl shadow-md flex items-center justify-center">
    <form on:submit|preventDefault={submitForm}>
        <div class="mb-4">
            <label for="username" class="block text-md font-medium text-gray-100 text-left">Username (8-16 bytes)</label>
            <input id="username" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="text" bind:value={name} />
        </div>
        <div class="mb-4">
            <label for="password" class="block text-md font-medium text-gray-100 text-left">Password (8-72 bytes)</label>
            <input id="password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="password" bind:value={password} />
        </div>
        <div class="mb-6">
            <label for="confirm-password" class="block text-md font-medium text-gray-100 text-left">Confirm password</label>
            <input id="confirm-password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="password" bind:value={confirm} />
        </div>
        <div class="flex items-center justify-between">
            <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline ">Submit</button>
        </div>
        <div class="mt-4 text-center">
            <p class="text-sm">Already have an account? <a href="/login" class="font-medium text-red-500 hover:text-red-700">Log in</a></p>
        </div>
    </form>
</div>
<div class="min-h-[24px] flex justify-center items-center">
    {#if showMessage}
        <p out:fade={{ duration: 500 }}>{msg}</p>
    {/if}
</div>

<style>
    input {
        color: #242424;
        padding: 6px 12px
    }
</style>
