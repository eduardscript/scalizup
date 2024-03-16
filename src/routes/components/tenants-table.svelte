<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { tenants } from '$lib/stores/tenants';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';
	import TableTenantActions from './table-actions-tenants.svelte';
	import ChevronLeft from 'svelte-radix/ChevronLeft.svelte';
	import ChevronRight from 'svelte-radix/ChevronRight.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { mediaQuery } from 'svelte-legos';

	const isDesktop = mediaQuery('(min-width: 768px)');

	let store = writable($tenants.tenants);

	let itemsCount = writable($tenants.count);

	$: {
		store.set($tenants.tenants);
		itemsCount.set($tenants.count);
	}

	$: {
		// If there are no tenants, redirect to the first page
		// FIX in the server
		if ($tenants.tenants.length === 0) {
			goto('/?page=1');
		}
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
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => createRender(TableTenantActions, { id: value })
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex, pageCount, pageSize } = pluginStates.page;
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
	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => {
				$pageIndex = $pageIndex - 1;
				goto(`/?page=${$pageIndex + 1}`);
			}}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<div>{$pageIndex + 1} of {$pageCount}</div>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => {
				$pageIndex = $pageIndex + 1;
				goto(`/?page=${$pageIndex + 1}`);
			}}>Next</Button
		>
	</div>

	<Pagination.Root count={$pageCount * $pageSize} perPage={$pageSize} let:pages let:currentPage>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton
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
						<Pagination.Link {page} isActive={currentPage == page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton
					on:click={() => {
						$pageIndex = $pageIndex + 1;
						goto(`/?page=${$pageIndex + 1}`);
					}}
				/>
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
</div>
