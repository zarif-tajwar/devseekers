import { z } from "zod";
import { authMethodValidator } from "./get-oauth-query.dto";

export const githubCallbackCookiesDto = z.object({
  github_oauth_state: z.string(),
  method: authMethodValidator,
  redirectUrl: z.string().url(),
});

export type githubCallbackCookiesDto = z.infer<typeof githubCallbackCookiesDto>;
