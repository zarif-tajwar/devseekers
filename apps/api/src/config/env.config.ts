import { ConfigService, registerAs } from "@nestjs/config";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

/**
 * Zod schema for validating env vars
 * NOTE: All env vars must be registered inside this object!!
 */
export const envSchema = z.object({
  FRONTEND_URL: z.string(),
  PORT: z.coerce.number().optional(),
});

/**
 * Loads the env vars from envSchema and validates them
 * Throws an error if a required env var is missing
 */
export const loadEnv = registerAs("envConfig", () => {
  const parsed = envSchema.safeParse(process.env);

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
