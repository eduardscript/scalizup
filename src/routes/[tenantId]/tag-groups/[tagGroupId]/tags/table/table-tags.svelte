<script lang="ts">
	import Table from '$lib/components/shared/table/table.svelte';
	import { createRender, createTable } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';
	import { writable } from 'svelte/store';
	import type { tagSchema } from '$lib/db/schema/tenant_schema';
	import TableCellTagActions from './cells/table-cell-tag-actions.svelte';
	import type { DeleteSchema, UpdateSchema } from '../schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	export let data: {
		entities: (typeof tagSchema.$inferSelect)[];
		totalEntities: number;
		forms: {
			delete: SuperValidated<Infer<DeleteSchema>>;
			update: SuperValidated<Infer<UpdateSchema>>;
		};
	};

	const rawStore = writable(data.entities);
	const itemsCount = writable(data.totalEntities);

	$: {
		rawStore.set(data.entities);
		itemsCount.set(data.totalEntities);
	}

	const table = createTable(rawStore, {
		page: addPagination({
			serverSide: true,
			serverItemCount: itemsCount,
			initialPageSize: DEFAULT_PAGE_OPTIONS.pageSize
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: (value) => value,
			id: 'actions',
			header: '',
			cell: ({ value }) =>
				createRender(TableCellTagActions, {
					tag: value,
					forms: data.forms
				})
		})
	]);
</script>

<Table {table} {columns} store={data} />
