<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Toaster, toast } from 'svelte-sonner';
	import { createSchema } from '../../schemas';

	let open = false;

	export let createForm;

	const form = superForm(createForm, {
		validators: zodClient(createSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				open = false;
				toast.success(`Tag Group ${$formData.name} has been successfully created.`);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Button on:click={() => (open = true)}>Create a Tag Group</Button>
<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create a new Tag Group</Dialog.Title>
			<Dialog.Description>Please enter the name of the new group.</Dialog.Description>
			<form method="POST" action="?/create" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Tag Group Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} placeholder="ingridients..." />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button>Create Tag Group</Form.Button>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
