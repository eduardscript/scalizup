import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/db/schema/*',
	out: './drizzle',
	dbCredentials: {
		connectionString: process.env.DB_URL
	}
} satisfies Config;
