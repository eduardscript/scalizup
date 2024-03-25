<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import '../app.pcss';
	import * as Menubar from '$lib/components/ui/menubar';
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/ui/badge';

	function submitForm() {
		const form = document.getElementById('signOutForm') as HTMLFormElement | null;
		if (form) {
			form.submit();
		}
	}

	export let data: { availableTenants: string; roles: string[] };
</script>

{#if data.availableTenants && data.availableTenants.length > 0}
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>Entities</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item href={`/${data.availableTenants[0]}/tag-groups`}>Tag Groups</Menubar.Item>
				<Menubar.Item href={`/${data.availableTenants[0]}/products`}>Products</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		{#if data.roles.includes('admin')}
			<Menubar.Menu>
				<Menubar.Trigger>Admin</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item href="/admin/tenants">Tenants</Menubar.Item>
					<Menubar.Item>Payments</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item href="/admin/users">Users</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		{/if}
		<Menubar.Menu>
			<Menubar.Trigger>Profile</Menubar.Trigger>
			<Menubar.Content>
				<form
					id="signOutForm"
					method="POST"
					action="/auth?/signOut"
					on:submit|preventDefault
					use:enhance
				>
					<Menubar.Item on:click={submitForm}>Sign Out</Menubar.Item>
				</form>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>

	<div class="m-10">
		<Toaster richColors />

		<slot />

		<Badge class="w-fit text-sm">{data.availableTenants}</Badge>
	</div>
{:else}
	<div class="m-10">
		<slot />
	</div>
{/if}
