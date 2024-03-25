<script lang="ts">
	import { createRender, createTable } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { tenants } from '$lib/stores/tenants';
	import Table from '$lib/components/shared/table/table.svelte';
	import { writable } from 'svelte/store';
	import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';
	import TableTenantActions from './cells/table-cell-tenant-actions.svelte';
	import TableCellTenantName from './cells/table-cell-tenant-name.svelte';
	import TableCellTenantEntities from './cells/table-cell-tenant-entities.svelte';
	import { Toaster } from 'svelte-sonner';

	let store = writable($tenants.tenants);
	let itemsCount = writable($tenants.count);

	$: {
		store.set($tenants.tenants);
		itemsCount.set($tenants.count);
	}

	const table = createTable(store, {
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
			header: 'Name',
			accessor: (item) => item,
			cell: ({ value }) => {
				return createRender(TableCellTenantName, { name: value.name, isEnabled: value.isEnabled });
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: 'Related Entities',
			cell: ({ value }) =>
				createRender(TableCellTenantEntities, {
					tenantId: value
				})
		}),
		table.column({
			accessor: (value) => value,
			id: 'actions',
			header: '',
			cell: ({ value }) => createRender(TableTenantActions, { tenant: value })
		})
	]);
</script>

<Table
	{table}
	{columns}
	store={{
		entities: $tenants.tenants,
		totalEntities: $tenants.count
	}}
/>
