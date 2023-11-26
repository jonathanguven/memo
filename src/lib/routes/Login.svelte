<script>
    let username = '';
    let password = '';
    let remember = false;

    const login = async () => {
        console.log("Logged in!");
    }
</script>

<div class="flex flex-col items-center bg-transparent">
    <h1 class="text-3xl p-4">Login</h1>
    <form on:submit|preventDefault={login} class="border-2 px-5 py-6 rounded-xl shadow-md">
        <div class="mb-4">
            <label for="username" class="block text-md font-medium text-gray-100 text-left">Username</label>
            <input id="username" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="text" bind:value={username} />
        </div>
        <div class="mb-4">
            <label for="password" class="block text-md font-medium text-gray-100 text-left">Password</label>
            <input id="password" class="w-64 bg-gray-100 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" type="password" bind:value={password} />
        </div>
        <div class="flex mt-6 text-left items-center">
            <label for="remember-me" class="text-sm">
                <input id="remember-me" type="checkbox" bind:checked={remember} />
                Remember me
            </label>
        </div>
        <div class="flex items-center justify-between mb-2 mt-4">
            <button type="submit" class="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline ">Submit</button>
        </div>
    </form>
</div>

<style>
    input {
        color: #242424;
        padding: 6px 12px
    }
</style>