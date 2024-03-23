<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.pcss';
	import * as Menubar from '$lib/components/ui/menubar';
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>Entities</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>Tag Groups</Menubar.Item>
			<Menubar.Item>Tags</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Admin</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>Tenants</Menubar.Item>
			<Menubar.Item>Payments</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item>Users</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

<div class="m-10">
	<Toaster richColors />

	<slot />
</div>
