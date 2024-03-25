import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		availableTenants: locals.user?.availableTenants,
		roles: locals.user?.roles
	};
};
