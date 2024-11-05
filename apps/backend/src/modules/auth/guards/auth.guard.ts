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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse() as Response;

    const sessionToken = request.cookies.session as string | undefined;

    if (!sessionToken) throw new UnauthorizedException();

    const auth = await this.authService.validateSession(sessionToken);

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

    (request as RequestWithUser).user = user;
    (request as RequestWithUser).sessionId = session.id;

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
