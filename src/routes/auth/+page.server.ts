import { superValidate } from 'sveltekit-superforms';
import { signUpSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	return {
		forms: {
			signUp: await superValidate(zod(signUpSchema)),
			signIn: await superValidate(zod(signUpSchema))
		}
	};
};
