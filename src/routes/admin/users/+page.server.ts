import db from '$lib/db';
import { userSchema } from '$lib/db/schema/user_schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (request) => {
	const users = await db.select().from(userSchema);

	return {
		users
	};
};
