<script lang="ts">
	import { Ellipsis, Trash2 } from 'lucide-svelte/icons';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let id: number;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions of {id}</DropdownMenu.Label>
			<DropdownMenu.Item>Update</DropdownMenu.Item>
			<DropdownMenu.Item>Delete</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>View history</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
