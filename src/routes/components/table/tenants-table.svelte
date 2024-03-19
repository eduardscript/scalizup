<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { tenants } from '$lib/stores/tenants';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';
	import TableTenantActions from './table-actions-tenants.svelte';
	import { mediaQuery } from 'svelte-legos';
	import { page } from '$app/stores';
	import TableTenantName from '../table-tenant-name.svelte';

	const isDesktop = mediaQuery('(min-width: 768px)');

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
				return createRender(TableTenantName, { name: value.name, isEnabled: value.isEnabled });
			}
		}),
		table.column({
			accessor: (value) => value,
			header: '',
			cell: ({ value }) => createRender(TableTenantActions, { tenant: value })
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { pageIndex, pageCount, pageSize } = pluginStates.page;

	const currentPage = parseInt($page.url.searchParams.get('page')!);

	$pageIndex = currentPage - 1;
</script>

<div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<Pagination.Root class="py-4" count={$tenants.count} perPage={$pageSize} let:pages>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton
					disabled={$pageIndex < 1}
					on:click={() => {
						$pageIndex = $pageIndex - 1;
						goto(`/?page=${$pageIndex + 1}`);
					}}
				/>
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link
							{page}
							isActive={$pageIndex + 1 == page.value}
							on:click={() => {
								$pageIndex = page.value - 1;
								goto(`/?page=${page.value}`);
							}}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton
					disabled={$pageIndex + 1 >= $pageCount}
					on:click={() => {
						$pageIndex = $pageIndex + 1;
						goto(`/?page=${$pageIndex + 1}`);
					}}
				/>
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
</div>
