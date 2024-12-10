import { ConfigService, registerAs } from "@nestjs/config";
import { envSchema, extractEnvValues } from "src/env";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

/**
 * Loads the env vars from envSchema and validates them
 * Throws an error if a required env var is missing
 */
export const loadEnv = registerAs("envConfig", () => {
  const parsed = envSchema.safeParse(extractEnvValues());

  if (parsed.error)
    throw new Error(
      `Invalid Environment Variables: ${fromZodError(parsed.error)}`,
    );

  return parsed.data;
});

/**
 * Env vars types
 */
export type EnvConfigType = z.infer<typeof envSchema>;

/**
 * Gets env value using ConfigService with type generics
 * Provides an typesafe way to consume env vars
 */
export const getEnvValue = <TEnvKey extends keyof EnvConfigType>(
  configService: ConfigService,
  envKey: TEnvKey,
) => configService.get(envKey) as EnvConfigType[TEnvKey];
