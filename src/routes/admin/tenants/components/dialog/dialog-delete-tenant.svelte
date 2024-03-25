<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form';
	import { tenants } from '$lib/stores/tenants';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { deleteSchema } from '../../schema';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';

	export let open: boolean;
	export let id: number;

	const form = superForm($tenants.forms.delete, {
		id: id.toString(),
		validators: zodClient(deleteSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.error(`Tenant ${id} has been successfully deleted.`);
				open = false;
			}
		}
	});

	const { form: formData, enhance } = form;

	$: open && formData.set({ id: id });
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to delete the tenant {id}?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. Deleting this tenant will permanently remove their account and
				associated data from our servers.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form method="POST" action="?/delete" use:enhance>
				<Form.Field {form} name="id">
					<Form.Control let:attrs>
						<Input type="hidden" {...attrs} bind:value={$formData.id} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<Form.Button variant="destructive">Delete</Form.Button>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
