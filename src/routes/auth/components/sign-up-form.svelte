<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signUpSchema, type SignUpSchema } from '../schemas';

	export let data: SuperValidated<Infer<SignUpSchema>>;

	const form = superForm(data, {
		id: 'sign-up',
		validators: zodClient(signUpSchema)
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Register</Card.Title>
		<Card.Description>Join our product journey</Card.Description>
	</Card.Header>
	<form method="POST" action="?/signUp" use:enhance>
		<Card.Content class="space-y-2">
			<div class="flex flex-col">
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>
						<Input {...attrs} bind:value={$formData.username} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
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
				<Form.Field {form} name="confirmPassword">
					<Form.Control let:attrs>
						<Form.Label>Confirm Password</Form.Label>
						<Input {...attrs} bind:value={$formData.confirmPassword} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</Card.Content>
		<Card.Footer>
			<Form.Button>Sign Up</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
