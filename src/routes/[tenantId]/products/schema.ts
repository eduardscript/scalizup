import { z } from 'zod';

export const createSchema = z.object({
	name: z.string().min(2).max(50),
	tenantId: z.coerce.number().min(0)
});

export type CreateSchema = typeof createSchema;

export const updateSchema = z.object({
	id: z.coerce.number().min(0),
	tenantId: z.coerce.number().min(0),
	name: z.string().min(2).max(50)
});

export type UpdateSchema = typeof updateSchema;

export const deleteSchema = z.object({
	id: z.coerce.number().min(0),
	tenantId: z.coerce.number().min(0)
});

export type DeleteSchema = typeof deleteSchema;
