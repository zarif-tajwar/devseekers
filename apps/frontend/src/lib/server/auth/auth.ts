import "server-only";
import { env } from "@/env";
import { cookies } from "next/headers";
import { User } from "@repo/shared-lib/types/auth/user";
import { cache } from "react";

/**
 * Checks if the user is logged in. Returns the user information if they are authenticated, or null if they are not.
 *
 * @returns A promise that resolves to a `User` object if authentication is successful,
 *          or `null` if the request fails, the response is not OK, or an error occurs.
 *
 * @example
 * ```typescript
 * const user = await auth();
 * if (user) {
 *   console.log("Authenticated:", user);
 * } else {
 *   console.log("Not authenticated.");
 * }
 * ```
 *
 * @remarks
 * This function sends a request to the backend with the current cookies as headers, which are required
 * for validating the user's session.
 *
 * @throws Logs an error to the console if the fetch request fails due to network issues or other errors.
 */
export const auth = cache(async (): Promise<null | User> => {
  const cookiesStr = cookies().toString();

  const req = new Request(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/validate`, {
    credentials: "include",
    headers: { Cookie: cookiesStr },
  });

  try {
    const res = await fetch(req);

    if (!res.ok) return null;

    return (await res.json()) as User;
  } catch (error) {
    console.error(`Auth Error: ${(error as Error).message}`);
    return null;
  }
});
