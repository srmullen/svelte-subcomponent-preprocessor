<Outer>
  <Inner />
</Outer>

<!-- asdf -->
{#component Outer}
  <script>
    import { onMount } from 'svelte';
    onMount(() => {
      console.log('outer');
    });
  </script>

  <slot />
{/component}

{#component Inner}
  <script>
    import { onMount } from 'svelte';
    onMount(() => {
      console.log('inner');
    });
  </script>

  <div>Inner</div>
{/component}