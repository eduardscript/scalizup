<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { type SignInSchema, type SignUpSchema } from './schemas';
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
			<SignUpForm data={data.forms.signUp} />
		</Tabs.Content>
		<Tabs.Content value="sign-in">
			<SignInForm data={data.forms.signIn} />
		</Tabs.Content>
	</Tabs.Root>
</div>
