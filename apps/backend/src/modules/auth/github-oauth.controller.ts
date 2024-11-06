import { ZodPipe } from "@/config/zod-filter.config";
import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { getOAuthQueryDto } from "./dtos/get-oauth-query.dto";
import { CookieOptions, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { GithubOAuthService } from "./github-oauth.service";
import { ConfigService } from "@nestjs/config";
import { getEnvValue } from "@/config/env.config";
import { githubCallbackCookiesDto } from "./dtos/github-callback-cookies.dto";
import { AuthOriginService } from "./auth-origin.service";
import { AuthError } from "./errors/auth-error";
import { OAuthCallbackResponse } from "./interfaces/oauth-callback-response.interface";

@Controller("auth/github")
export class GithubOAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authOriginService: AuthOriginService,
    private readonly githubOAuthService: GithubOAuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * This endpoint will get called from our client
   * to initiate github login flow
   */
  @Get()
  initGithubOAuth(
    @Req() req: Request,
    @Query(new ZodPipe(getOAuthQueryDto)) query: getOAuthQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    /**
     * Validate the request origin
     */
    let origin = req.headers.origin;

    if (!origin) {
      try {
        origin = new URL(req.headers.referer || "").origin;
      } catch {
        // Will throw an error if theres no referer
        throw new ForbiddenException();
      }
    }

    if (!origin || !this.authOriginService.validateOrigin(origin)) {
      throw new ForbiddenException();
    }

    // Get the necessary data for github oauth
    const { authUrl, state } = this.githubOAuthService.getOAuthData();

    const isProduction =
      getEnvValue(this.configService, "NODE_ENV") === "production";

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      maxAge: 10 * 60 * 1000, // 10 mins expiration time
      sameSite: "lax",
    };

    // Place necessary  cookies
    res.cookie("github_oauth_state", state, cookieOptions);
    // Storing the redirect url to send the user back to the client/frontend later.
    res.cookie("redirectUrl", `${origin}${query.redirectUrl}`, cookieOptions);
    res.cookie("method", query.method, cookieOptions);

    // Redirecting to github sign in flow
    res.redirect(authUrl.toString());
  }

  /**
   * Github will call this endpoint automatically,
   * passing the necessary properties in the query parameters.
   */
  @Get("callback")
  async validateGithubOAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    /**
     * Validate original client's origin / redirect url
     */
    const parsedOrigin = githubCallbackCookiesDto
      .pick({ redirectUrl: true })
      .safeParse(req.cookies);

    if (!parsedOrigin.success) throw new ForbiddenException();

    const origin = new URL(parsedOrigin.data.redirectUrl).origin;

    if (!this.authOriginService.validateOrigin(origin))
      throw new ForbiddenException();

    // Attaching the origin and redirect url to the response object, so that interceptors can use them later
    (res as OAuthCallbackResponse).origin = origin;
    (res as OAuthCallbackResponse).redirectUrl = parsedOrigin.data.redirectUrl;

    /**
     * Validate Cookies
     */
    const parsedCookies = githubCallbackCookiesDto
      .omit({ redirectUrl: true })
      .safeParse(req.cookies);

    if (parsedCookies.error) {
      const errors = parsedCookies.error.format();

      if (errors.github_oauth_state) throw new AuthError("RESTART");

      throw new ForbiddenException();
    }
    const cookies = parsedCookies.data;

    const storedState = cookies.github_oauth_state;

    /**
     * Validate query params
     */
    const code = req.query.code;
    const state = req.query.state;

    if (typeof code !== "string" || typeof state !== "string") {
      throw new AuthError("RESTART");
    }

    if (state !== storedState) {
      throw new AuthError("RESTART");
    }

    // Initiate authentication
    const { sessionToken, expiresAt } =
      await this.githubOAuthService.authenticate({
        code,
        authMode: "login",
      });

    // Create session cookie
    res.cookie("session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(expiresAt),
      secure: getEnvValue(this.configService, "NODE_ENV") === "production",
    });

    // Redirect the user back to the client
    res.redirect(parsedOrigin.data.redirectUrl);
  }
}
