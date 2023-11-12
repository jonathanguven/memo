<script>
  import Goodbye from './lib/Goodbye.svelte';
  import Hello from './lib/Hello.svelte'

  let msg = '';

  function handleMessage(event) {
    msg = event.detail;
    console.log(msg);
  }
</script>

<main>
  <h1>FlashAI</h1>

  <div class="card">
    <Hello on:messageFetched={handleMessage} />
    <Goodbye on:messageFetched={handleMessage} />
      {#if msg}
        <p>{msg}</p>
      {/if}
  </div>

  <p></p>
</main>

