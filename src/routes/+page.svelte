<script lang="ts">
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import TenantsTable from './components/tenants-table.svelte';
	import { tenants } from '$lib/stores/tenants';
	import DialogCreateTenant from './components/dialog-create-tenant.svelte';

	export let data;

	$: $tenants = {
		tenants: data.dbTenants,
		count: data.count,
		totalPages: data.totalPages,
		forms: {
			create: data.form
		}
	};
</script>

<div class="mb-3 flex justify-end">
	<DialogCreateTenant />
</div>
{#if $tenants.tenants.length === 0}
	<div class="flex justify-center font-semibold">No tenants created yet!</div>
{:else}
	<TenantsTable />
{/if}
