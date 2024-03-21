<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import type { PaginationState } from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import { queryParam } from 'sveltekit-search-params';

	export let totalEntities: number;

	const totalEntitiesStore = writable(totalEntities);

	$: {
		totalEntitiesStore.set(totalEntities);
	}

	export let state: PaginationState;

	const { pageIndex, pageCount, pageSize } = state;

	const queryPageNumber = queryParam('page', {
		encode: (value: number) => value.toString(),
		decode: (value: string | null) => (value ? parseInt(value) : null)
	});

	$: {
		$pageIndex = $queryPageNumber! - 1;
	}
</script>

<Pagination.Root class="py-4" count={$totalEntitiesStore} perPage={$pageSize} let:pages>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton
				disabled={$pageIndex < 1}
				on:click={() => {
					$pageIndex = $pageIndex - 1;
					$queryPageNumber = $pageIndex - 1;
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

							$queryPageNumber = page.value;
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
					$queryPageNumber = $pageIndex + 1;
				}}
			/>
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>
