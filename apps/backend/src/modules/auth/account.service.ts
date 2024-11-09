import { DatabaseTransaction } from "@/database/database-transaction";
import { DrizzleService } from "@/database/drizzle.service";
import { Injectable } from "@nestjs/common";
import { accounts, OAuthAccountsInsert } from "./schema/accounts.sql";
import { users } from "@/modules/user/schema/users.sql";
import { eq, or } from "drizzle-orm";

@Injectable()
export class AccountService {
  constructor(private drizzleService: DrizzleService) {}

  /**
   * Creates an oauth account
   * @param accountData the data to create the account
   * @param transaction drizzle postgres transaction
   */
  async createOAuthAccount(
    accountData: OAuthAccountsInsert,
    transaction?: DatabaseTransaction,
  ) {
    const db = transaction || this.drizzleService.db;
    await db.insert(accounts).values(accountData);
  }

  /**
   * Checks if an email is already registered in the system
   * @param email input email
   * @param transaction drizzle postgres transaction
   * @returns true if an email is already in use
   */
  async checkIfEmailInUse(email: string, transaction?: DatabaseTransaction) {
    const db = transaction || this.drizzleService.db;
    return await db
      .select({ userId: users.id })
      .from(users)
      .innerJoin(accounts, eq(accounts.userId, users.id))
      .where(or(eq(users.email, email), eq(accounts.email, email)))
      .limit(1)
      .then((res) => res.length > 0);
  }
}
