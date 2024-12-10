import { Global, Logger, Module } from "@nestjs/common";
import { Pool } from "pg";
import { DatabaseOptions } from "./database-options";
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
} from "./database.module-definition";
import { DrizzleService } from "./drizzle.service";

@Global()
@Module({
  exports: [DrizzleService],
  providers: [
    DrizzleService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: async ({ connectionString }: DatabaseOptions) => {
        const logger = new Logger("PostgresDB", { timestamp: true });
        const pool = new Pool({
          connectionString,
        });

        await pool.connect().catch(() => {
          const message = "Failed to establish database connection";
          logger.error(message);
          throw new Error(message);
        });

        logger.log("The connection was successfully established");

        return pool;
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
