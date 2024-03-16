<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { tenants } from '$lib/stores/tenants';
	import { formSchema } from '../schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let open = false;

	const form = superForm($tenants.forms.create, {
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				open = false;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Button on:click={() => (open = true)}>Create a Business</Button>
<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create a New Business</Dialog.Title>
			<Dialog.Description>
				Please enter the name of the new business. This name will be publicly displayed.
			</Dialog.Description>
			<form method="POST" action="?/create" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Business Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} placeholder="companyinc..." />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button>Create Business</Form.Button>
			</form>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
