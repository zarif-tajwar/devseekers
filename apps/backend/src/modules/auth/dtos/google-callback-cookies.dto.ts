import { z } from "zod";
import { authMethodValidator } from "./get-oauth-query.dto";

export const googleCallbackCookiesDto = z.object({
  google_oauth_state: z.string(),
  google_code_verifier: z.string(),
  method: authMethodValidator,
  redirectUrl: z.string().url(),
});

export type googleCallbackCookiesDto = z.infer<typeof googleCallbackCookiesDto>;
