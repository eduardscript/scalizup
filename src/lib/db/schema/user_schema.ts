import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userSchema = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	roles: text('roles').notNull().default('[]'),
	availableTenants: text('available_tenants').notNull().default('[]')
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
