<script lang="ts">
	import TableUsers from './components/table/table-users.svelte';

	export let data;
</script>

<div class="mb-3 flex justify-between">
	<div>
		<div class="flex items-center gap-2">
			<span class="font-bold">User management</span>
		</div>
	</div>
</div>

<TableUsers
	data={{
		entities: data.users,
		totalEntities: data.users.length
	}}
/>
