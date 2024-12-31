"use client";

import { User } from "@repo/shared-lib/types/auth/user";
import { useQuery, QueryStatus } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";

type SessionContextType = { user: User | null; status: QueryStatus };

const SessionContext = createContext<SessionContextType | null>(null);

/**
 * Provides the session context to its children.
 *
 * @param children - React components that consume the session context.
 * @returns A provider wrapping the child components.
 */
export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const req = new Request(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/validate`,
        {
          credentials: "include",
        },
      );

      try {
        const res = await fetch(req);

        if (!res.ok) return null;

        return (await res.json()) as User;
      } catch (error) {
        console.error(`Auth Error: ${(error as Error).message}`);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <SessionContext.Provider value={{ user: data || null, status }}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Hook to access the current session context.
 *
 * @throws If used outside of a `SessionProvider`.
 * @returns The session context containing user and status.
 *
 * @example
 * // Wrap your components with SessionProvider in a parent component.
 * import { SessionProvider, useSession } from './session-context';
 *
 * const SomeParentComponent = () => (
 *   <SessionProvider>
 *     <Dashboard />
 *   </SessionProvider>
 * );
 *
 * // Use the useSession hook to access user and status.
 * const Dashboard = () => {
 *   const { user, status } = useSession();
 *
 *   if (status === 'loading') return <div>Loading...</div>;
 *   if (user) return <div>Welcome, {user.fullname}!</div>;
 *   return <div>Please log in.</div>;
 * };
 */
export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context)
    throw new Error(`useSession was used outside of SessionProvider!`);

  return context;
};
