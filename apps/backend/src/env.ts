import { z } from "zod";

/**
 * (NOTE)
 * Check here to see an usage example: https://github.com/devseekers/devseekers/blob/main/docs/examples/BACKEND_USAGE_EXAMPLES.md#add-and-use-environment-variables-in-nestjs-backend-with-typesafety
 */

/**
 * Zod schema for validating env vars
 * (NOTE)
 * All env vars validators must be inside this object
 */
export const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional(),
  ADMIN_FRONTEND_URL: z.string().url(),
  REDIS_URI: z.string().url(),
  POSTGRES_URI: z.string().url(),
  SESSION_EXPIRY_TIME_IN_DAYS: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  // Backend url
  BACKEND_URL: z.string().url(),
  // Google OAuth
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  // Github OAuth
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
});

/**
 * (NOTE)
 * All env vars must be registered here
 * and also to the root turbo.json global Env
 */
export const extractEnvValues = () => ({
  FRONTEND_URL: process.env.FRONTEND_URL,
  PORT: process.env.PORT,
  ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL,
  REDIS_URI: process.env.REDIS_URI,
  POSTGRES_URI: process.env.POSTGRES_URI,
  SESSION_EXPIRY_TIME_IN_DAYS: process.env.SESSION_EXPIRY_TIME_IN_DAYS,
  NODE_ENV: process.env.NODE_ENV,
  // Backend url
  BACKEND_URL: process.env.BACKEND_URL,
  // Google OAuth
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  // Github OAuth
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
});
