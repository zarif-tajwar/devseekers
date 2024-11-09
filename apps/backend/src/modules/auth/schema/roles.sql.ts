import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userRoles } from "./user-roles.sql";

export const roles = pgTable("roles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const RolesSelect = typeof roles.$inferSelect;
export const RolesInsert = typeof roles.$inferInsert;

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));
