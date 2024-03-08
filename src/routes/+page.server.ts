import db from '$lib/db';
import { tenantSchema } from '$lib/db/schema/tenant_schema.js';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { formSchema } from './schema';
import { logger } from '$lib/utils';

export const load: PageServerLoad = async () => {
	const tenants = await db.select().from(tenantSchema);

	logger.info('Getting all tenants');

	return {
		form: await superValidate(zod(formSchema)),
		tenants
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name } = form.data;

		logger.info(`Insert a new tenant with name: ${name}`);

		await db.insert(tenantSchema).values({ name }).execute();

		return {
			form
		};
	}
};
