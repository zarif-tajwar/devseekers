"use client";

import { env } from "@/env";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@repo/ui/components/core/sonner";
import { useRouter } from "next/navigation";

/**
 * Custom hook for handling OAuth login and registration.
 *
 * @param method - login or register?
 * @param provider - The OAuth provider. Currently, "google" and "github" are supported.
 * @param redirectUrl - The URL to redirect the user to after a successful login, specified as a string starting with '/'.
 *
 * @returns A mutation object from `react-query` providing loading state, function trigger and more.
 *
 * @remarks
 * This hook uses `useMutation` from `react-query` to provide loading state and do error handling.
 * If the login request fails, an error toast is shown at the top center of the screen.
 *
 * @example
 * ```tsx
 * const { mutateAsync: loginWithGoogle } = useOAuthLogin({
 *   method: "login",
 *   provider: "google",
 *   redirectUrl: "/dashboard",
 * });
 *
 * return (
 *   <button onClick={() => loginWithGoogle()}>
 *     Login with Google
 *   </button>
 * );
 * ```
 */
export const useOAuthProvider = ({
  authMethod,
  provider,
  redirectUrl,
}: {
  authMethod: "login" | "register";
  provider: "google" | "github";
  redirectUrl: `/${string}`;
}) => {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const req = new Request(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/${provider}?method=${authMethod}&redirectUrl=${redirectUrl}`,
        // To include and accept cookies
        { credentials: "include" },
      );
      const res = await fetch(req);

      type SuccessResult = { authUrl: string };
      type ErrorResult = { message: string };

      const result = (await res.json()) as SuccessResult | ErrorResult;

      // If success redirect the user to auth url
      if ("authUrl" in result) {
        router.push(result.authUrl);
        return;
      }

      // If error throw the message
      if (!res.ok) {
        throw new Error(result.message);
      }
    },
    onError: (error) => {
      // Catch the error, then show a toast
      toast.error(error.message, { position: "top-center" });
    },
  });
};
