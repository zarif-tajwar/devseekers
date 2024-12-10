import { User } from "@repo/shared-lib/types/auth/user";

export interface SessionEntity extends User {
  id: string;
  expiresAt: number;
  createdAt: number;
  userId: string;
}
