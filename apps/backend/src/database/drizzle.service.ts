import { Inject, Injectable } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CONNECTION_POOL } from "./database.module-definition";

/**
 * (OPTIONAL)
 * Place Drizzle schema exports in this object
 * to make them usable for Drizzle's NoSQL-style query builder.
 */
export const allSchemas = {};

@Injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof allSchemas>;
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.db = drizzle(this.pool, { schema: allSchemas });
  }
}
