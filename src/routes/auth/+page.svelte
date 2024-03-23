<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { type SignInSchema, type SignUpSchema } from './schema';
	import { type SuperValidated, type Infer } from 'sveltekit-superforms';
	import SignUpForm from './components/sign-up-form.svelte';
	import SignInForm from './components/sign-in-form.svelte';

	export let data: {
		forms: {
			signIn: SuperValidated<Infer<SignInSchema>>;
			signUp: SuperValidated<Infer<SignUpSchema>>;
		};
	};
</script>

<div class="flex justify-center">
	<Tabs.Root value="sign-in" class="w-[400px]">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="sign-up">Sign Up</Tabs.Trigger>
			<Tabs.Trigger value="sign-in">Sign In</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="sign-up">
			<Card.Root>
				<Card.Header>
					<Card.Title>Register</Card.Title>
					<Card.Description>Join our product journey</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<SignUpForm data={data.forms.signUp} />
				</Card.Content>
				<Card.Footer>
					<Button>Sign Up</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="sign-in">
			<Card.Root>
				<Card.Header>
					<Card.Title>Login</Card.Title>
					<Card.Description>Get back to your experience</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<SignInForm data={data.forms.signIn} />
				</Card.Content>
				<Card.Footer>
					<Button>Sign In</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
