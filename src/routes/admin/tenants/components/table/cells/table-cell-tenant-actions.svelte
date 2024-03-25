<script lang="ts">
	import { Ellipsis, Pencil, History, Trash2 } from 'lucide-svelte/icons';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import DialogDeleteTenant from '../../dialog/dialog-delete-tenant.svelte';
	import DialogUpdateTenant from '../../dialog/dialog-update-tenant.svelte';
	import type { tenantSchema } from '$lib/db/schema/tenant_schema';

	export let tenant: typeof tenantSchema.$inferSelect;

	const actions = {
		update: false,
		delete: false
	};
</script>

<DialogDeleteTenant bind:open={actions.delete} id={tenant.id} />
<DialogUpdateTenant bind:open={actions.update} {tenant} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions of {tenant.id}</DropdownMenu.Label>
			<DropdownMenu.Item
				class="flex gap-2 data-[highlighted]:text-amber-400"
				on:click={() => (actions.update = true)}
			>
				<Pencil class="h-4 w-4" />
				Update
			</DropdownMenu.Item>
			<DropdownMenu.Item
				class="flex gap-2 data-[highlighted]:text-red-400"
				on:click={() => (actions.delete = true)}
			>
				<Trash2 class="h-4 w-4" />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="flex gap-2">
			<History class="h-4 w-4" />
			View history
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
