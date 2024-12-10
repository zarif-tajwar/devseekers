import { z } from "zod";

export const authMethodValidator = z.enum(["login", "register"]);

export type AuthMethod = z.infer<typeof authMethodValidator>;

export const getOAuthQueryDto = z.object({
  method: authMethodValidator,
  redirectUrl: z.string().refine((value) => {
    try {
      new URL(value);
      return false;
    } catch {
      if (value.startsWith("/")) return true;
      return false;
    }
  }),
});

export type getOAuthQueryDto = z.infer<typeof getOAuthQueryDto>;
