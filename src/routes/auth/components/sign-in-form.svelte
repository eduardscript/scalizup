<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signInSchema, type SignInSchema } from '../schemas';
	import * as Card from '$lib/components/ui/card/index.js';

	export let data: SuperValidated<Infer<SignInSchema>>;

	const form = superForm(data, {
		id: 'sign-in',
		validators: zodClient(signInSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Login</Card.Title>
		<Card.Description>Get back to your experience</Card.Description>
	</Card.Header>
	<form method="POST" action="?/signIn" use:enhance>
		<Card.Content class="space-y-2">
			<div class="flex flex-col">
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>
						<Input {...attrs} bind:value={$formData.username} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input {...attrs} bind:value={$formData.password} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</Card.Content>
		<Card.Footer>
			<Form.Button>Sign In</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
