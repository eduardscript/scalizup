import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userSchema = pgTable('user', {
	id: text('id').primaryKey()
});

export const sessionSchema = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userSchema.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
