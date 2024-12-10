import { Reflector } from "@nestjs/core";
import { UserRole } from "@repo/shared-lib/types/auth/user-role";

export const Roles = Reflector.createDecorator<UserRole[]>();
