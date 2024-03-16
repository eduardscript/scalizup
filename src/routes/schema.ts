import { z } from 'zod';

export const formSchema = z.object({
	name: z.string().min(2).max(50)
});

export const deleteSchema = z.object({
	id: z
		.string()
		.transform((val) => parseInt(val))
		.pipe(z.number().gt(0))
});

export type FormSchema = typeof formSchema;
