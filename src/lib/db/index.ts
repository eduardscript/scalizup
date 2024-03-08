import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const sql = postgres({
	host: env.DB_HOST,
	port: parseInt(env.DB_PORT),
	username: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE,
	max: 1
});

const db = drizzle(sql, { ...schema });

const migrateSchemas = async () => {
	await migrate(db, { migrationsFolder: 'drizzle' });

	// Run the following to migrate the schema
	// await sql.end();
};

await migrateSchemas();

export default db;
export { sql };
