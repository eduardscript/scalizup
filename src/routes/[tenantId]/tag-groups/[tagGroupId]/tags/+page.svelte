<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import DialogCreateTag from './dialog/dialog-create-tag.svelte';
	import TableTags from './table/table-tags.svelte';

	export let data;
</script>

<div class="mb-3 flex justify-between">
	<div>
		<div class="flex items-center gap-2">
			<a href={`/${data.tenantId}/tag-groups`}>
				<ArrowLeft class="transition-transform duration-200 hover:scale-90 hover:text-slate-500" />
			</a>

			<span class="font-bold">Tag management of {data.tagGroup.name}</span>
		</div>
	</div>
	<DialogCreateTag createForm={data.forms.create} />
</div>

{#if data.pagination.totalEntities === 0}
	<div class="flex justify-center font-semibold">No tags created yet!</div>
{:else}
	<TableTags
		data={{
			entities: data.tagGroups,
			totalEntities: data.pagination.totalEntities,
			forms: data.forms
		}}
	/>
{/if}

<Badge class="w-fit text-sm">{data.tenantId}</Badge>
