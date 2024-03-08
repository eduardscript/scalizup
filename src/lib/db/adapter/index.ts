import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '..';
import { sessionSchema, userSchema } from '../schema/user_schema';
import type { lucia } from '$lib/auth';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionSchema, userSchema);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}

export default adapter;
