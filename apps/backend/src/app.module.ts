import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { getEnvValue, loadEnv } from "./config/env.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { OriginGuard } from "./modules/auth/guards/origin.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadEnv],
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // @ts-expect-error: broken types -> https://github.com/liaoliaots/nestjs-redis/issues/552
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            url: getEnvValue(configService, "REDIS_URI"),
          },
        };
      },
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionString: getEnvValue(configService, "POSTGRES_URI"),
      }),
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: OriginGuard,
    },
  ],
})
export class AppModule {}
