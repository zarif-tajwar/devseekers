import { AUTH_ERROR_MAPS } from "@repo/shared-lib/constants/auth/auth-error-maps";

export type AuthErrorKey = keyof typeof AUTH_ERROR_MAPS;

export class AuthError extends Error {
  key: AuthErrorKey;
  message: string;
  cause?: any;

  constructor(key: AuthErrorKey, cause?: any) {
    super();
    this.key = key;
    this.message = AUTH_ERROR_MAPS[key].message;
    this.cause = cause;
  }
}
