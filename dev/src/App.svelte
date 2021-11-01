<script>
	import SubComponent from './SubComponent.svelte';
	import Table from './components/Table.svelte';
	import NoScriptTag from './NoScriptTag.svelte';

	export let name;

	const data = ["svelte", "subcomponent", "preprocessor"];
	const data2 = ["try", "it", "out"];
</script>

<main>
	<h1>Hello {name}!</h1>
	<SubComponent {data} />
	<SubComponent data={data2} />

	<NoScriptTag />

	<Table cols={['A', 'B', 'C']} />

</main>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>