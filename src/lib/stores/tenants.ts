import type { tenantSchema } from '$lib/db/schema/tenant_schema';
import { writable, type Writable } from 'svelte/store';
import type { SuperValidated } from 'sveltekit-superforms';

type TenantData = {
	tenants: (typeof tenantSchema.$inferSelect)[];
	count: number;
	totalPages: number;
	forms: {
		create: SuperValidated<
			{
				name: string;
			},
			any,
			{
				name: string;
			}
		>;
	};
};

export const tenants: Writable<TenantData> = writable({
	count: 0,
	totalPages: 0,
	tenants: [],
	forms: {
		create: null!
	}
});
