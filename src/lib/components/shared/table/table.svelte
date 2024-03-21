<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Column, Render, Subscribe, createTable } from 'svelte-headless-table';
	import TablePagination from './table-pagination.svelte';
	import clsx from 'clsx';

	export let table: ReturnType<typeof createTable<any, any>>;
	export let columns: Column<any, any>[];
	export let store: {
		entities: any[];
		totalEntities: number;
	};

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
</script>

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
								<Table.Cell
									{...attrs}
									class={clsx({
										'text-right': cell.id === 'actions'
									})}
								>
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

{#if pluginStates.page !== undefined}
	<TablePagination state={pluginStates.page} totalEntities={store.totalEntities} />
{/if}
