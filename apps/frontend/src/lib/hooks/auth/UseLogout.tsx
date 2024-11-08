"use client";

import { env } from "@/env";
import { toast } from "@repo/ui/components/core/sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * Custom hook for logging out a user by triggering a logout request to the backend API.
 * It uses React Query's `useMutation` to handle the logout
 * and refreshes the page upon successful logout.
 *
 * @returns A mutation object that can be used to initiate
 * the logout process and handle its states (loading, success, error).
 *
 * @example
 * ```tsx
 * const { mutateAsync: handleLogout } = useLogout();
 *
 * return <button onClick={()=>handleLogout()}>Logout</button>
 * ```
 */
export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const req = new Request(
        `${env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
        // To include and accept cookies
        { credentials: "include" },
      );
      const res = await fetch(req);

      if (res.status === 401) {
        throw new Error("You're already logged out!");
      }

      // If success
      router.refresh();
    },
    onError: (error) => {
      // Catch the error, then show a toast
      toast.error(error.message, { position: "top-center" });
    },
  });
};
