<script>
    import { createEventDispatcher } from "svelte";
    const url = import.meta.env.VITE_API_URL;

    const dispatch = createEventDispatcher();

    async function getMessage() {
        try {
            const res = await fetch(`${url}/api/image`, { credentials: "include" })
            const data = await res.json();
            dispatch('messageFetched', data);
        } catch (error) {
            console.error('Error fetching message: ', error);
        }
    }
</script>
  
<button 
    on:click={getMessage}
    class="rounded-lg border border-transparent bg-neutral-900 hover:text-color-neutral-500 px-5 py-2.5 text-base font-medium cursor-pointer transition-colors duration-200"
>
    Click for Cat
</button>


