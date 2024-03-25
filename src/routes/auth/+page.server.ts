import { setError, superValidate } from 'sveltekit-superforms';
import { signInSchema, signUpSchema } from './schemas';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import db from '$lib/db';
import { userSchema } from '$lib/db/schema/user_schema';
import { lucia } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';
import { logger } from '$lib/utils';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		forms: {
			signUp: await superValidate(zod(signUpSchema)),
			signIn: await superValidate(zod(signUpSchema))
		}
	};
};

export const actions: Actions = {
	signUp: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signUpSchema));

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(form.data.password);

		await db.insert(userSchema).values({
			id: userId,
			username: form.data.username,
			email: form.data.email,
			password: hashedPassword
		});

		logger.info(`User ${form.data.username} signed up`);

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	},
	signIn: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signInSchema));

		const existingUser = (
			await db
				.selectDistinct()
				.from(userSchema)
				.where(eq(userSchema.username, form.data.username))
				.limit(1)
				.execute()
		)[0];

		if (!existingUser) {
			return setError(form, 'username', 'Incorrect username or password');
		}

		const validPassword = await new Argon2id().verify(existingUser.password, form.data.password);
		if (!validPassword) {
			return setError(form, 'username', 'Incorrect username or password');
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	},
	signOut: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(401);
		}

		logger.info(`User ${locals.session.userId} signed out`);

		await lucia.invalidateSession(locals.session.id);

		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
