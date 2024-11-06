import { DatabaseTransaction } from "@/database/database-transaction";
import { DrizzleService } from "@/database/drizzle.service";
import { Providers } from "@/modules/auth/constants/account";
import { accounts } from "@/modules/auth/schema/accounts.sql";
import { userRoles } from "@/modules/auth/schema/user-roles.sql";
import { Injectable } from "@nestjs/common";
import { UserRole } from "@repo/shared-lib/types/auth/user-role";
import { and, eq, sql } from "drizzle-orm";
import { roles } from "../auth/schema/roles.sql";
import { users, UsersInsert } from "./schema/users.sql";
import { jsonAgg } from "@/database/util";
import { User } from "@repo/shared-lib/types/auth/user";

@Injectable()
export class UserService {
  constructor(private drizzleService: DrizzleService) {}

  /**
   * Gets the user by oauth id
   * @param provider OAuth Provider
   * @param providerId Provider ID
   * @param transaction Transaction object (optional). Allows this function to be used in transactions.
   * @returns the target user
   */
  async getUserByOAuthId(
    provider: Providers,
    providerId: string,
    transaction?: DatabaseTransaction,
  ) {
    const db = transaction || this.drizzleService.db;

    const userData = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        avatarUrl: users.avatarUrl,
        fullname:
          sql<string>`concat(${users.firstName},' ',${users.lastName})`.as(
            "fullname",
          ),
        roles: jsonAgg({ name: roles.name }),
      })
      .from(users)
      .innerJoin(accounts, eq(accounts.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, users.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId))
      .where(
        and(
          eq(accounts.type, "oauth"),
          eq(accounts.provider, provider),
          eq(accounts.providerId, providerId),
        ),
      )
      .groupBy(users.id)
      .then((res) => res.at(0));

    if (!userData) return null;

    const rolesData = userData.roles.map(({ name }) => name) as UserRole[];

    const userObject: User = { ...userData, roles: rolesData };

    return userObject;
  }

  /**
   * Creates a user
   * @param userData the new user's data
   * @param transaction drizzle postgres transaction
   * @returns created user id
   */
  async createUser(userData: UsersInsert, transaction?: DatabaseTransaction) {
    const db = transaction || this.drizzleService.db;

    const createdUserId = await db
      .insert(users)
      .values(userData)
      .returning({ createdUserId: users.id })
      .then((res) => res.at(0)!.createdUserId);

    return createdUserId;
  }
}
