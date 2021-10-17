<script>
  export let cols = [];
</script>

<div class="flex">
  {#each cols as col, i}
    <Column name={col} number={i} />
  {/each}
</div>

<style>
  .flex {
    display: flex;
    justify-content: space-around;
  }
</style>

<!-- svelte-ignore missing-declaration -->
<Component name="Column">
  <script>
    export let name;
    export let number;
  </script>

  <div class="column">{name} {number}</div>
</Component>