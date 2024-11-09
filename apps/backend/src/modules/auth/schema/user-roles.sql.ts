import { users } from "@/modules/user/schema/users.sql";
import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { roles } from "./roles.sql";

export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    cpk: primaryKey({ columns: [table.userId, table.roleId] }),
  }),
);

export type UserRolesSelect = typeof userRoles.$inferSelect;
export type UserRolesInsert = typeof userRoles.$inferInsert;

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  users: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  roles: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
