import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ZodFilter } from "./config/zod-filter.config";
import { getEnvValue } from "./config/env.config";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger("NestFactory");
  const configService = app.get(ConfigService);

  const FRONTEND_URL = getEnvValue(configService, "FRONTEND_URL");
  const ADMIN_FRONTEND_URL = getEnvValue(configService, "ADMIN_FRONTEND_URL");
  const PORT = getEnvValue(configService, "PORT") || 3000;

  app.enableCors({
    origin: [FRONTEND_URL, ADMIN_FRONTEND_URL],
    credentials: true,
  });

  app.useGlobalFilters(new ZodFilter());

  await app.listen(PORT);

  logger.log(`🚀 Backend Server is Running at http://localhost:${PORT} 🚀`);
}
bootstrap();
