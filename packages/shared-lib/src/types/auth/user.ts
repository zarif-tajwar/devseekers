import { UserRole } from "./user-role";

export interface User {
  id: string;
  fullname: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  roles: UserRole[] | null;
}
