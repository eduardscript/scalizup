import { relations, sql } from 'drizzle-orm';
import { serial, text, timestamp, pgTable, boolean } from 'drizzle-orm/pg-core';

export const tenantSchema = pgTable('tenant', {
	id: serial('id'),
	name: text('name').notNull(),
	isEnabled: boolean('is_enabled').default(false).notNull(),
	createdAt: timestamp('created_at').default(sql`NOW()`),
	updatedAt: timestamp('updated_at')
});

export const tenantSchemaRelations = relations(tenantSchema, ({ many }) => ({
	tagGroups: many(tagGroupSchema)
}));

export const tagGroupSchema = pgTable('tag_group', {
	id: serial('id'),
	tenantId: serial('tenant_id').notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').default(sql`NOW()`),
	updatedAt: timestamp('updated_at')
});

export const tagGroupSchemaRelations = relations(tagGroupSchema, ({ one }) => ({
	tenantId: one(tenantSchema, {
		fields: [tagGroupSchema.tenantId],
		references: [tenantSchema.id]
	})
}));
