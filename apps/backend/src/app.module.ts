import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { getEnvValue, loadEnv } from "./config/env.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule, RedisModuleOptions } from "@liaoliaots/nestjs-redis";

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
