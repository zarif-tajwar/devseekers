import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { RequestWithUser } from "./interfaces/request-with-user.interface";
import { Response } from "express";
import { GetUser } from "./decorators/get-user.decorator";
import { User } from "@repo/shared-lib/types/auth/user";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Logs out by removing sessions from db and client cookies
   */
  @Get("logout")
  @UseGuards(AuthGuard)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.invalidateSession(req.sessionId, req.user.id);
    res.clearCookie("session");

    const shouldRedirect = req.query.redirect;

    if (shouldRedirect === "true") {
      if (req.headers.referer) {
        res.redirect(req.headers.referer);
        return;
      }
      if (req.headers.origin) {
        res.redirect(req.headers.origin);
        return;
      }
    }
  }

  /**
   * Returns the user object
   * if the request is authorized
   */
  @Get("validate")
  @UseGuards(AuthGuard)
  async validate(@GetUser() user: User) {
    return user;
  }
}
