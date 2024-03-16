import db from '$lib/db';
import { tenantSchema } from '$lib/db/schema/tenant_schema.js';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { formSchema } from './schema';
import { logger } from '$lib/utils';
import { asc, count } from 'drizzle-orm';

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

	const totalPages = Math.ceil(numberOfTenants[0].count / DEFAULT_PAGE_OPTIONS.pageSize);

	return {
		form: await superValidate(zod(formSchema)),
		dbTenants,
		count: numberOfTenants[0].count,
		totalPages
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
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
	}
};
