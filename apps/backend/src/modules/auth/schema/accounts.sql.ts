import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { accountTypes, Providers, providers } from "../constants/account";
import { relations } from "drizzle-orm";
import { users } from "@/modules/user/schema/users.sql";

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type", { enum: accountTypes }).notNull(),
    provider: text("provider", { enum: providers }),
    providerId: text("provider_id"),
    email: text("email").unique().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    cpk: primaryKey({ columns: [table.userId, table.type, table.provider] }),
  }),
);

export type AccountsSelect = typeof accounts.$inferSelect;
export type AccountsInsert = typeof accounts.$inferInsert;

export type OAuthAccountsInsert = AccountsInsert & {
  provider: Providers;
  providerId: string;
  type: "oauth";
};

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
