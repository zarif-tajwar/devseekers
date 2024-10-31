import { z } from "zod";

/**
 * Zod schema for validating env vars
 * NOTE: All env vars must be registered inside this object!!
 */
export const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().optional(),
  ADMIN_FRONTEND_URL: z.string().url(),
  REDIS_URI: z.string().url(),
  POSTGRES_URI: z.string().url(),
});
