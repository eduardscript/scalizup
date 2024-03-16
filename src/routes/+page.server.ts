import db from '$lib/db';
import { tenantSchema } from '$lib/db/schema/tenant_schema.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { deleteSchema, formSchema } from './schema';
import { logger } from '$lib/utils';
import { asc, count, eq } from 'drizzle-orm';

import { z } from 'zod';
import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';

export const load: PageServerLoad = async ({ url }) => {
	logger.info('Getting all tenants');

	const queryParamsSchema = z.object({
		page: z
			.string()
			.nullable()
			.transform((val) => parseInt(val || '1'))
			.transform((val) => (val === 0 ? 1 : val))
	});

	const queryParams = queryParamsSchema.parse({
		page: url.searchParams.get('page')
	});

	const offset = (queryParams.page - 1) * DEFAULT_PAGE_OPTIONS.pageSize;

	const dbTenants = await db
		.select()
		.from(tenantSchema)
		.orderBy(asc(tenantSchema.id))
		.limit(DEFAULT_PAGE_OPTIONS.pageSize)
		.offset(offset);

	const numberOfTenants = await db
		.selectDistinct({ count: count(tenantSchema.id) })
		.from(tenantSchema);

	return {
		form: await superValidate(zod(formSchema)),
		deleteForm: await superValidate(zod(deleteSchema)),
		dbTenants,
		count: numberOfTenants[0].count
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, zod(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name } = form.data;

		await db.insert(tenantSchema).values({ name }).execute();

		logger.info(`Inserted a new tenant with name: ${name}`);

		return {
			form
		};
	},
	delete: async ({ request }) => {
		const form = await superValidate(request, zod(deleteSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		logger.info(`Deleted tenant with id: ${id}`);

		await db.delete(tenantSchema).where(eq(tenantSchema.id, id));

		return {
			form
		};
	}
};
