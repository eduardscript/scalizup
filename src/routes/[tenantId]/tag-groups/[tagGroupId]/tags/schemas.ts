import { z } from 'zod';

export const createSchema = z.object({
	name: z.string().min(2).max(50),
	tagGroupId: z.coerce.number().min(0),
	tenantId: z.coerce.number().min(0)
});

export const updateSchema = z.object({
	id: z.number().min(0),
	name: z.string().min(2).max(50)
});

export const deleteSchema = z.object({
	id: z.number().min(0)
});
