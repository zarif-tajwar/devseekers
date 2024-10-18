import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ZodFilter } from "./config/zod-filter.config";
import { getEnvValue } from "./config/env.config";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = getEnvValue(configService, "PORT") || 3000;

  app.useGlobalFilters(new ZodFilter());

  await app.listen(PORT);

  console.log(`🚀 Backend Server is Listening at http://localhost:${PORT} 🚀`);
}
bootstrap();
