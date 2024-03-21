<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import type { tagSchema } from '$lib/db/schema/tenant_schema';
	import { updateSchema } from '../schemas';

	export let open: boolean;
	export let tag: typeof tagSchema.$inferSelect;
	export let updateForm: SuperValidated<any, any, any>;

	const form = superForm(updateForm, {
		validators: zodClient(updateSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.warning(`Tag ${$formData.name} (${$formData.id}) has been updated.`);
				open = false;
			}
		}
	});

	const { form: formData, enhance } = form;

	$: open &&
		formData.set({
			id: tag.id,
			name: tag.name
		});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update tag {tag.name}</Dialog.Title>
			<Dialog.Description>Modify the details of the tag.</Dialog.Description>
			<form method="POST" action="?/update" use:enhance>
				<Form.Field {form} name="id">
					<Form.Control let:attrs>
						<Input type="hidden" {...attrs} bind:value={$formData.id} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Tag Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex items-end justify-between">
					<span class="text-sm font-thin text-slate-500">
						({$formData.id})
					</span>
					<Form.Button>Update</Form.Button>
				</div>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
