import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().min(2).max(50)
});

export const updateSchema = z.object({
	id: z.number().gt(0),
	name: z.string().min(2).max(50),
	isEnabled: z.boolean()
});

export const deleteSchema = z.object({
	id: z.number().gt(0)
});

export type FormSchema = typeof formSchema;
