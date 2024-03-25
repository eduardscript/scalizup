import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (context) => {
	return {
		products: [
			{
				id: 1,
				name: 'Product 1'
			},
			{
				id: 2,
				name: 'Product 2'
			}
		]
	};
};
