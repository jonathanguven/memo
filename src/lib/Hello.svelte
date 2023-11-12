<script>
     import { createEventDispatcher } from "svelte";

     const dispatch = createEventDispatcher();

     async function getMessage() {
          try {
               const res = await fetch('http://localhost:3000/api/hello')
               const data = await res.json();
               dispatch('messageFetched', data.message);
          } catch (error) {
               console.error('Error fetching message: ', error);
          }
     }
</script>

<button on:click={getMessage}>
     Hello
</button>
