import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import { logger } from '$lib/utils';

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
	logger.info('Migrating schemas');

	let folder = '';

	if (env.NODE_ENV === 'production') {
		folder = path.basename(path.resolve(process.cwd()));
		logger.info('Migrations folder ', folder);
	}

	logger.info(`Schemas locations /${folder}drizzle`);
	await migrate(db, { migrationsFolder: `${folder}drizzle` });
};

await migrateSchemas();

export default db;
export { sql };
