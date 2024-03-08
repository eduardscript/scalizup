import { sql } from 'drizzle-orm';
import { serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const tenantSchema = pgTable('tenant', {
	id: serial('id'),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').default(sql`NOW()`),
	updatedAt: timestamp('updated_at')
});
