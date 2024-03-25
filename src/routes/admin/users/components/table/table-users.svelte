<script lang="ts">
	import Table from '$lib/components/shared/table/table.svelte';
	import { createTable } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';
	import { writable } from 'svelte/store';
	import type { userSchema } from '$lib/db/schema/user_schema';

	export let data: {
		entities: (typeof userSchema.$inferSelect)[];
		totalEntities: number;
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
			accessor: 'username',
			header: 'Name'
		}),
		table.column({
			accessor: 'email',
			header: 'Email'
		}),
		table.column({
			accessor: 'roles',
			header: 'Role'
		}),
		table.column({
			accessor: 'availableTenants',
			header: 'Available Tenants'
		})
	]);
</script>

<Table {table} {columns} store={data} />
