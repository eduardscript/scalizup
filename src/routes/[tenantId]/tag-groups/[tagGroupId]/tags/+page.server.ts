import { logger } from '$lib/utils';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import db from '$lib/db';
import { and, asc, count, eq } from 'drizzle-orm';
import { tagGroupSchema, tagSchema } from '$lib/db/schema/tenant_schema';
import { DEFAULT_PAGE_OPTIONS } from '$lib/utils/default';
import { superValidate } from 'sveltekit-superforms';
import { createSchema, deleteSchema, updateSchema } from './schemas';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url, params: { tenantId, tagGroupId } }) => {
	logger.info(`Getting all tags of tenant ${tenantId} and tag group ${tagGroupId}`);

	const queryParamsSchema = z.object({
		tenantId: z.coerce.number().gt(2).int(),
		tagGroupId: z.coerce.number().gt(2).int(),
		page: z
			.string()
			.nullable()
			.transform((val) => parseInt(val || ''))
			.transform((val) => (val === 0 ? 1 : val))
	});

	const queryParams = queryParamsSchema.parse({
		page: url.searchParams.get('page'),
		tagGroupId,
		tenantId
	});

	if (isNaN(queryParams.page) || queryParams.page < 1) {
		redirect(301, `${url.pathname}?page=1`);
	}

	const tagGroup = await db
		.select({
			tagGroupName: tagGroupSchema.name
		})
		.from(tagGroupSchema)
		.where(eq(tagGroupSchema.id, queryParams.tagGroupId))
		.execute();

	const { tagGroupName } = tagGroup[0];

	const tagGroups = await db.query.tag.findMany({
		where: eq(tagSchema.tagGroupId, queryParams.tagGroupId),
		orderBy: [asc(tagSchema.id)],
		limit: DEFAULT_PAGE_OPTIONS.pageSize,
		offset: (queryParams.page - 1) * DEFAULT_PAGE_OPTIONS.pageSize
	});

	const numberOfTags = (
		await db
			.selectDistinct({ count: count(tagSchema.id) })
			.from(tagSchema)
			.where(eq(tagSchema.tagGroupId, queryParams.tagGroupId))
	)[0].count;

	const numberOfPages = Math.ceil(numberOfTags / DEFAULT_PAGE_OPTIONS.pageSize);

	if (numberOfPages > 0 && queryParams.page > numberOfPages) {
		redirect(301, `${url.pathname}?page=${numberOfPages}`);
	}

	return {
		tenantId,
		tagGroups,
		tagGroup: {
			name: tagGroupName
		},
		forms: {
			create: await superValidate(zod(createSchema)),
			update: await superValidate(zod(updateSchema)),
			delete: await superValidate(zod(deleteSchema))
		},
		pagination: {
			totalEntities: numberOfTags
		}
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const formData = await request.formData();
		formData.append('tenantId', params.tenantId!);
		formData.append('tagGroupId', params.tagGroupId!);

		const form = await superValidate(formData, zod(createSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, tagGroupId } = form.data;

		console.log(form.data);

		const tagGroup = await db.query.tagGroup.findFirst({
			where: eq(tagGroupSchema.id, tagGroupId)
		});

		if (!tagGroup) {
			return fail(404, { message: `Tag group with id ${tagGroupId} not found` });
		}

		await db
			.insert(tagSchema)
			.values({
				name,
				tagGroupId
			})
			.execute();

		logger.info(`Inserted a new tag with name: ${name} for tag group: ${tagGroup?.name}`);

		return {
			form
		};
	},
	update: async ({ request, params }) => {
		const paramsZod = z.object({
			tenantId: z.coerce.number().gt(0),
			tagGroupId: z.coerce.number().gt(0)
		});

		const validationParams = paramsZod.safeParse(params);

		if (!validationParams.success) {
			return fail(400, { message: 'Invalid params' });
		}

		const form = await superValidate(request, zod(updateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		await db
			.update(tagSchema)
			.set({
				name: form.data.name
			})
			.where(and(eq(tagSchema.id, id), eq(tagSchema.tagGroupId, validationParams.data.tagGroupId)))
			.execute();

		logger.info(`Update tag with id: ${id} for tag group: ${params.tagGroupId}`);

		return {
			form
		};
	},
	delete: async ({ request, params }) => {
		const paramsZod = z.object({
			tenantId: z.coerce.number().gt(0),
			tagGroupId: z.coerce.number().gt(0)
		});

		const validation = paramsZod.safeParse(params);
		if (!validation.success) {
			return fail(400, { message: 'Invalid params' });
		}

		const form = await superValidate(request, zod(deleteSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		await db.delete(tagSchema).where(eq(tagSchema.id, id)).execute();

		logger.info(`Deleted tag with id: ${id} for tag group: ${params.tagGroupId}`);

		return {
			form
		};
	}
};
