<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import type { tenantSchema } from '$lib/db/schema/tenant_schema';
	import { tenants } from '$lib/stores/tenants';
	import { updateSchema } from '../../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Switch } from '$lib/components/ui/switch';
	import { Input } from '$lib/components/ui/input';
	import { Toaster, toast } from 'svelte-sonner';

	export let open: boolean;

	const form = superForm($tenants.forms.update, {
		validators: zodClient(updateSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.warning(`Tenant ${$formData.id} has been successfully updated.`);
				open = false;
			}
		}
	});

	export let tenant: typeof tenantSchema.$inferSelect;

	const { form: formData, enhance } = form;

	$: open &&
		formData.set({
			id: tenant.id,
			name: tenant.name,
			isEnabled: tenant.isEnabled
		});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update tenant {$formData.id}</Dialog.Title>
			<Dialog.Description>Update the business name and its status.</Dialog.Description>
			<form method="POST" action="?/update" use:enhance>
				<input type="hidden" name="id" bind:value={$formData.id} />

				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Business Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="isEnabled">
					<Form.Control let:attrs>
						<div class="flex flex-row items-center justify-between rounded-lg border p-4">
							<div class="flex flex-col">
								<Form.Label>Is Enabled</Form.Label>
								<Form.Description class="mt-2">
									Activate this business to enable it to engage with the public audience.
									<span class="block text-xs">
										Activation incurs a fee and will be billed to the business owner.
									</span>
								</Form.Description>
							</div>
							<Switch includeInput {...attrs} bind:checked={$formData.isEnabled} />
						</div>
					</Form.Control>
				</Form.Field>

				<Form.Button>Update Business</Form.Button>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
<Toaster richColors />
