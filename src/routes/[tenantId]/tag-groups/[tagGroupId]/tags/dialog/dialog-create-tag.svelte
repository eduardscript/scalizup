<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { createSchema, type CreateSchema } from '../schemas';

	let open = false;

	export let createForm: SuperValidated<Infer<CreateSchema>>;

	const form = superForm(createForm, {
		validators: zodClient(createSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				open = false;
				toast.success(`Tag ${$formData.name} has been successfully created.`);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Button on:click={() => (open = true)}>Create a Tag</Button>
<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create a new Tag</Dialog.Title>
			<Dialog.Description>Please enter the name of the new tag.</Dialog.Description>
			<form method="POST" action="?/create" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Tag Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} placeholder="peeper..." />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button>Create Tag</Form.Button>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
