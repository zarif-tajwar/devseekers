import { accounts } from "@/modules/auth/schema/accounts.sql";
import { userRoles } from "@/modules/auth/schema/user-roles.sql";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").unique().notNull(),
  username: text("username").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UsersSelect = typeof users.$inferSelect;
export type UsersInsert = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  userRoles: many(userRoles),
}));
