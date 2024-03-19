<script lang="ts">
	import TenantsTable from './components/table/tenants-table.svelte';
	import { tenants } from '$lib/stores/tenants';
	import DialogCreateTenant from './components/dialog/dialog-create-tenant.svelte';

	export let data;

	$: $tenants = {
		tenants: data.dbTenants,
		count: data.count,
		totalPages: data.totalPages,
		forms: {
			create: data.form,
			update: data.updateForm,
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
