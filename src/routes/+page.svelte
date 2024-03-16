<script lang="ts">
	import TenantsTable from './components/tenants-table.svelte';
	import { tenants } from '$lib/stores/tenants';
	import DialogCreateTenant from './components/dialog-create-tenant.svelte';

	export let data;

	$: console.log('re-rendered');
	$: $tenants = {
		tenants: data.dbTenants,
		count: data.count,
		forms: {
			create: data.form,
			delete: data.deleteForm
		}
	};
</script>

<div class="mb-3 flex justify-end">
	<DialogCreateTenant />
</div>
{#if $tenants.count === 0}
	<div class="flex justify-center font-semibold">No tenants created yet!</div>
{:else}
	<TenantsTable />
{/if}
