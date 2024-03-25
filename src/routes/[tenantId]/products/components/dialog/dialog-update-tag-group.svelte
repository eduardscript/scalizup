<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { updateSchema, type UpdateSchema } from '../../schemas';
	import type { tagGroupSchema } from '$lib/db/schema/tenant_schema';

	export let open: boolean;
	export let tagGroup: typeof tagGroupSchema.$inferSelect;
	export let updateForm: SuperValidated<Infer<UpdateSchema>>;

	const form = superForm(updateForm, {
		validators: zodClient(updateSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.warning(`Tag Group ${$formData.name} (${$formData.id}) has been updated.`);
				open = false;
			}
		}
	});

	const { form: formData, enhance } = form;

	$: open &&
		formData.set({
			id: tagGroup.id,
			name: tagGroup.name,
			tenantId: tagGroup.tenantId
		});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update tag group {tagGroup.name}</Dialog.Title>
			<Dialog.Description>
				Modify the details of the tag group. Please note that updating this tag group will affect
				all related tags associated with it.
			</Dialog.Description>
			<form method="POST" action="?/update" use:enhance>
				<Form.Field {form} name="tenantId">
					<Form.Control let:attrs>
						<Input {...attrs} type="hidden" bind:value={tagGroup.tenantId} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="id">
					<Form.Control let:attrs>
						<Input {...attrs} type="hidden" bind:value={tagGroup.id} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Tag Group Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex items-end justify-between">
					<span class="text-sm font-thin text-slate-500">
						({tagGroup.id})
					</span>
					<Form.Button>Update</Form.Button>
				</div>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
