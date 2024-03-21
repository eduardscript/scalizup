<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DialogCreateTagGroup from './components/dialog/dialog-create-tag-group.svelte';
	import TableTagGroups from './components/table/table-tag-groups.svelte';

	export let data;
</script>

<div class="mb-3 flex justify-between">
	<div>
		<Badge class="w-fit text-sm">{data.tenantId}</Badge>
		<span class="font-bold">Tag Groups Management</span>
	</div>
	<DialogCreateTagGroup createForm={data.forms.create} />
</div>

{#if data.tagGroups.length === 0}
	<div class="flex justify-center font-semibold">No tag groups created yet!</div>
{:else}
	<TableTagGroups
		data={{
			entities: data.tagGroups,
			totalEntities: data.totalEntities,
			forms: data.forms
		}}
	/>
{/if}
