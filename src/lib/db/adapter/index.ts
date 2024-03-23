import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '..';
import { sessionSchema, userSchema } from '../schema/user_schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionSchema, userSchema);

export default adapter;
