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
<Component name="ListItem">
	<script>
		import { onMount } from 'svelte';
		export let item;

		onMount(() => {
			console.log(`item is ${item}`);
		});
	</script>

	<li>{item}</li>
</Component>

<!-- svelte-ignore missing-declaration -->
<Component name="ListTitle">
	<script>
		export let title = '';
	</script>

	<h1 class="title">{title}</h1>

	<style>
		.title {
			color: 'red'
		}
	</style>
</Component>