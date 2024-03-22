import db from '$lib/db';
import { tagGroupSchema } from '$lib/db/schema/tenant_schema';
import { logger } from '$lib/utils';
import { and, asc, count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createSchema, deleteSchema, updateSchema } from './schemas';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';

export const load: PageServerLoad = async ({ url, params: { tenantId } }) => {
	logger.info(`Getting all tag tag groups of tenant ${tenantId}`);

	const queryParamsSchema = z.object({
		tenantId: z.coerce.number().gt(0).int(),
		page: z
			.string()
			.nullable()
			.transform((val) => parseInt(val || ''))
			.transform((val) => (val === 0 ? 1 : val))
	});

	const queryParams = queryParamsSchema.parse({
		page: url.searchParams.get('page'),
		tenantId
	});

	if (isNaN(queryParams.page) || queryParams.page < 1) {
		redirect(301, `${url.pathname}?page=1`);
	}

	const tagGroups = await db.query.tagGroup.findMany({
		where: eq(tagGroupSchema.tenantId, parseInt(tenantId)),
		orderBy: [asc(tagGroupSchema.id)],
		limit: DEFAULT_PAGE_OPTIONS.pageSize,
		offset: (queryParams.page - 1) * DEFAULT_PAGE_OPTIONS.pageSize
	});

	const numberOfTagGroups = (
		await db
			.selectDistinct({ count: count(tagGroupSchema.id) })
			.from(tagGroupSchema)
			.where(eq(tagGroupSchema.tenantId, queryParams.tenantId))
	)[0].count;

	const numberOfPages = Math.ceil(numberOfTagGroups / DEFAULT_PAGE_OPTIONS.pageSize);

	if (numberOfPages > 0 && queryParams.page > numberOfPages) {
		redirect(301, `${url.pathname}?page=${numberOfPages}`);
	}

	return {
		tagGroups: tagGroups,
		totalEntities: numberOfTagGroups,
		tenantId: queryParams.tenantId,
		forms: {
			create: await superValidate(zod(createSchema)),
			update: await superValidate(zod(updateSchema)),
			delete: await superValidate(zod(deleteSchema))
		}
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const formData = await request.formData();
		formData.append('tenantId', params.tenantId);

		const form = await superValidate(formData, zod(createSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, tenantId } = form.data;

		await db.insert(tagGroupSchema).values({ name, tenantId }).execute();

		logger.info(`Inserted a new tag with name: ${name} for tenant: ${tenantId}`);

		return {
			form
		};
	},
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(updateSchema));

		if (form.data.tenantId.toString() !== params.tenantId.toString()) {
			form.errors.tenantId?.push(
				'The tenantId in the form does not match the tenantId in the URL. This is likely a security issue.'
			);

			return fail(400, { form });
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, tenantId, name } = form.data;

		await db
			.update(tagGroupSchema)
			.set({ name })
			.where(and(eq(tagGroupSchema.id, id), eq(tagGroupSchema.tenantId, tenantId)))
			.execute();

		logger.info(`Updated tag group with id: ${id} for tenant: ${params.tenantId}`);

		return {
			form
		};
	},
	delete: async ({ request, params }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(deleteSchema));

		if (form.data.tenantId.toString() !== params.tenantId.toString()) {
			form.errors.tenantId?.push(
				'The tenantId in the form does not match the tenantId in the URL. This is likely a security issue.'
			);

			return fail(400, { form });
		}

		if (!form.valid) {
			console.log('error');
			return fail(400, { form });
		}

		const { id } = form.data;

		await db.delete(tagGroupSchema).where(eq(tagGroupSchema.id, id)).execute();

		logger.info(`Deleted tag group with id: ${id} for tenant: ${params.tenantId}`);

		return {
			form
		};
	}
};
