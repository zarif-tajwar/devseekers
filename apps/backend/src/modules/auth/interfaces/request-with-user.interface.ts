import { User } from "@repo/shared-lib/types/auth/user";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user: User;
  sessionId: string;
}
