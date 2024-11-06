import { ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { allSchemas } from "./drizzle.service";

export type DatabaseTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof allSchemas,
  ExtractTablesWithRelations<typeof allSchemas>
>;
