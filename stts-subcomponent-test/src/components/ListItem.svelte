
	<script>
		import { onMount } from 'svelte';
		export let item;

		onMount(() => {
			console.log(`item is ${item}`);
		});
	</script>

	<li>^^^^{item}^^^^</li>
