import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { getEnvValue } from "@/config/env.config";
import { RequestWithUser } from "../interfaces/request-with-user.interface";
import { User } from "@repo/shared-lib/types/auth/user";
import { DisableSessionAutoExtend } from "../decorators/disable-session-auto-extend.decorator";
import { Reflector } from "@nestjs/core";

/**
 * AuthGuard checks for a valid user session and denies access if the user is not authenticated.
 *
 * Once authenticated, the guard attaches the authenticated user object and the session ID
 * to the request object, so they can be accessed in later route handlers.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse() as Response;

    // Get session token from cookies
    const sessionToken = request.cookies.session as string | undefined;

    if (!sessionToken) throw new UnauthorizedException();

    // Get session auto extension disable metadata
    const isAutoExtendDisabled = !!this.reflector.get(
      DisableSessionAutoExtend,
      context.getHandler(),
    );

    // Validate the session token
    const auth = await this.authService.validateSession(
      sessionToken,
      isAutoExtendDisabled,
    );

    if (!auth) {
      response.clearCookie("session");
      throw new UnauthorizedException();
    }

    const { session, isExpiryUpdated } = auth;

    const user: User = {
      id: session.userId,
      email: session.email,
      avatarUrl: session.avatarUrl,
      fullname: session.fullname,
      roles: session.roles,
      username: session.username,
    };

    // Attach the request object with user object and session id
    (request as RequestWithUser).user = user;
    (request as RequestWithUser).sessionId = session.id;

    // Replace the existing session token cookie with updated expiry time
    if (isExpiryUpdated) {
      response.cookie("session", sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(session.expiresAt),
        secure: getEnvValue(this.configService, "NODE_ENV") === "production",
      });
    }

    return true;
  }
}
