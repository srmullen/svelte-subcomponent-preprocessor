<script context="module">
	console.log('module context');
</script>

<script>
	export let data = [];
</script>

<ListTitle title="Super Cool Preprocesser" />
<ul>
	{#each data as item}
		<ListItem {item} />
	{/each}
</ul>

<!-- svelte-ignore missing-declaration -->
{#component ListItem}
	<script>
		import { onMount } from 'svelte';
		export let item;

		onMount(() => {
			console.log(`item is ${item}`);
		});
	</script>

	<li>^^^^{item}^^^^</li>
{/component}

<!-- {#component ListItem}
	<script>
		import { onMount } from 'svelte';
		export let item;

		onMount(() => {
			console.log(`item is ${item}`);
		});
	</script>

	<li>---{item}---</li>
{/component} -->

{#component ListTitle}
	<script>
		export let title = '';
	</script>

	<h1 class="title">---{title}---</h1>

	<style>
		.title {
			color: 'red'
		}
	</style>
{/component}