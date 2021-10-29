svelte-subcomponent-preprocessor
================================

The `svelte-subcomponent-preprocessor` allows you to write more than one component within a svelte file. The subcomponents are written in a `{#component}` block and remain local to the svelte file. Here's an example

```html
<!-- List.svelte -->
<script>
  export let items = ['svelte', 'subcomponent', 'preprocessor'];
</script>

<ul>
  {#each items as item}
    <Item {item} />
  {/each}
</ul>

{#component Item}
  <script>
    import { onMount } from 'svelte';
    export let item;

    onMount(() => {
      console.log(item);
    });
  </script>

  <li>{item}!!!</li>

  <style>
    li {
      color: red;
    }
  </style>
{/component}
```

Installation and Configuration
------------------------------

`npm install --save-dev svelte-subcomponent-preprocessor`

In your svelte config import the preprocessor and add it to the preprocess array.

```js
import subcomponentPreprocessor from 'svelte-subcomponent-preprocessor';
import sveltePreprocess from 'svelte-preprocess';

svelte({
  preprocess: [
    subcomponentPreprocessor(),
    sveltePreprocess() // must come after subcomponentPreprocessor
  ]
})
```

If you're using [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) it must run after `svelte-subcomponent-preprocessor`.

If you're using [Vite](https://github.com/vitejs/vite) or [SvelteKit](https://github.com/sveltejs/kit) you'll need a bit of extra configuration to get the subcomponents to work with the dev server. You need the following in your vite config.

```js
{
  // ...
  server: {
    watch: {
      ignored: ['!**/node_modules/.svelte-subcomponent-preprocessor/**']
    }
  },
  optimizeDeps: {
    exclude: ['.svelte-subcomponent-preprocessor']
  },
  // ...
}
```

Full vite configuration.

```js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    watch: {
      ignored: ['!**/node_modules/.svelte-subcomponent-preprocessor/**']
    }
  },
  optimizeDeps: {
    exclude: ['.svelte-subcomponent-preprocessor']
  }
});
```

Or in SvelteKit the `server` and `optimizeDeps` config would go inside the [`svelte.config.js` `vite` object](https://kit.svelte.dev/docs#configuration-vite).

Usage
-----

To define a subcomponent put your component code inside a `#component` block. Pass the name of the subcomponent to the block, like so...

```html
{#component ComponentName}    
  <h1>My Component</h1>
{/component}

<div>
  <ComponentName />
<div>
```

Issues
------

- Need to handle commented-out components and script tags. Should have a function that strips out html comments before matching regexes.